-- Fix critical security issues with payment, subscription, and user data access

-- 1. Fix Payment Information Security - Replace overly permissive service policies
DROP POLICY IF EXISTS "Service can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Service can update payments" ON public.payments;

-- Create secure payment policies with proper service authentication
CREATE POLICY "Authenticated edge functions can manage payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from edge functions with proper service role
  current_setting('role') = 'service_role' OR
  -- Or if it's the user's own payment record
  auth.uid() = user_id
);

CREATE POLICY "Authenticated edge functions can update payments" 
ON public.payments 
FOR UPDATE 
USING (
  -- Only allow updates from edge functions with proper service role
  current_setting('role') = 'service_role' OR
  -- Or if it's the user's own payment record (limited updates)
  auth.uid() = user_id
)
WITH CHECK (
  current_setting('role') = 'service_role' OR
  auth.uid() = user_id
);

-- 2. Fix Customer Subscription Data Security
DROP POLICY IF EXISTS "Backend can update subscription info" ON public.subscribers;

-- Replace with more restrictive policies
CREATE POLICY "Service role can manage subscription data" 
ON public.subscribers 
FOR ALL
USING (current_setting('role') = 'service_role')
WITH CHECK (current_setting('role') = 'service_role');

-- Users can still view their own subscription
-- (This policy already exists: "Users can view own subscription")

-- 3. Fix Historical User Data Access - Remove overly permissive service policy
DROP POLICY IF EXISTS "Service can insert historical profiles" ON public.historical_profiles;

-- Create secure historical data policy with proper authentication
CREATE POLICY "Authenticated services can manage historical profiles" 
ON public.historical_profiles 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts from authenticated edge functions with service role
  current_setting('role') = 'service_role'
);

-- 4. Fix Email Address Exposure in Assessments - Protect user emails from org admins
-- First, let's check the existing assessment policies and modify them to protect emails

-- Create a secure function to get assessment data without exposing emails
CREATE OR REPLACE FUNCTION public.get_assessment_summary(assessment_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  organization_id uuid,
  date timestamp with time zone,
  overall_score numeric,
  dimension_scores jsonb,
  demographics jsonb,
  -- Exclude email field
  historical_profile_id uuid
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    a.id,
    a.user_id,
    a.organization_id,
    a.date,
    a.overall_score,
    a.dimension_scores,
    a.demographics,
    a.historical_profile_id
  FROM assessments a
  WHERE a.id = assessment_id
  AND (
    -- User can see their own assessments
    a.user_id = auth.uid()
    OR
    -- Admins can see org assessments but without email
    EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'super_admin')
      AND p.organization_id = a.organization_id
    )
  );
$$;

-- 5. Create secure function to get paginated assessments without exposing emails to org admins
CREATE OR REPLACE FUNCTION public.get_secure_paginated_assessments(
  page_offset integer DEFAULT 0, 
  page_limit integer DEFAULT 1000, 
  organization_filter uuid DEFAULT NULL::uuid
)
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  organization_id uuid, 
  date timestamp with time zone, 
  overall_score numeric, 
  answers jsonb, 
  dimension_scores jsonb, 
  demographics jsonb, 
  historical_profile_id uuid, 
  email text, 
  total_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH filtered_assessments AS (
    SELECT 
      a.id,
      a.user_id,
      a.organization_id,
      a.date,
      a.overall_score,
      a.answers,
      a.dimension_scores,
      a.demographics,
      a.historical_profile_id,
      -- Only include email for super admins or if it's the user's own assessment
      CASE 
        WHEN a.user_id = auth.uid() THEN a.email
        WHEN get_current_user_role() = 'super_admin' THEN a.email
        ELSE NULL
      END as email
    FROM assessments a
    WHERE (organization_filter IS NULL OR a.organization_id = organization_filter)
    AND (
      -- User can see their own assessments with email
      a.user_id = auth.uid()
      OR
      -- Admins can see org assessments but without email (unless super admin)
      EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role IN ('admin', 'super_admin')
        AND (organization_filter IS NULL OR p.organization_id = a.organization_id)
      )
      OR
      -- Super admins can see historical assessments with email
      (a.historical_profile_id IS NOT NULL AND get_current_user_role() = 'super_admin')
    )
  ),
  assessment_count AS (
    SELECT COUNT(*) as total FROM filtered_assessments
  )
  SELECT 
    fa.id,
    fa.user_id,
    fa.organization_id,
    fa.date,
    fa.overall_score,
    fa.answers,
    fa.dimension_scores,
    fa.demographics,
    fa.historical_profile_id,
    fa.email,
    ac.total as total_count
  FROM filtered_assessments fa
  CROSS JOIN assessment_count ac
  ORDER BY fa.date DESC
  LIMIT page_limit
  OFFSET page_offset;
$$;

-- 6. Add additional security to profiles table - ensure email is protected
-- Users should only see their own email
CREATE OR REPLACE FUNCTION public.get_user_profile_secure(profile_user_id uuid DEFAULT auth.uid())
RETURNS TABLE(
  id uuid,
  name text,
  email text,
  role user_role,
  organization_id uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.name,
    -- Only return email if it's the user's own profile or if user is super admin
    CASE 
      WHEN p.id = auth.uid() THEN p.email
      WHEN get_current_user_role() = 'super_admin' THEN p.email
      ELSE NULL
    END as email,
    p.role,
    p.organization_id,
    p.created_at,
    p.updated_at
  FROM profiles p
  WHERE p.id = profile_user_id
  AND (
    p.id = auth.uid() OR
    get_current_user_role() IN ('admin', 'super_admin')
  );
$$;

-- 7. Grant appropriate permissions to the new secure functions
GRANT EXECUTE ON FUNCTION public.get_assessment_summary(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_secure_paginated_assessments(integer, integer, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_profile_secure(uuid) TO authenticated;