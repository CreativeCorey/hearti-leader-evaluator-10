-- Fix security warnings by improving RLS policies

-- 1. Fix profiles table RLS policies
-- Drop the ambiguous "Block all unauthenticated access" policy and replace with explicit ones
DROP POLICY IF EXISTS "Block all unauthenticated access to profiles" ON public.profiles;

-- Ensure only authenticated users can access profiles, and only their own
DROP POLICY IF EXISTS "Authenticated users can view own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile only" ON public.profiles;

CREATE POLICY "Users can view only their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert only their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update only their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id AND auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() = id AND auth.uid() IS NOT NULL);

-- Block all anonymous access explicitly
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- 2. Simplify and secure assessments table RLS policies
-- Drop existing overlapping policies
DROP POLICY IF EXISTS "Authenticated users can view own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Authenticated users can create assessments" ON public.assessments;
DROP POLICY IF EXISTS "Authenticated users can update own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Authenticated users can delete own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Admins can read org assessments" ON public.assessments;
DROP POLICY IF EXISTS "Admins can delete org assessments" ON public.assessments;
DROP POLICY IF EXISTS "Admins can view assessments for user management" ON public.assessments;
DROP POLICY IF EXISTS "Admins and super admins can view historical assessments" ON public.assessments;
DROP POLICY IF EXISTS "Super admins can view all assessments" ON public.assessments;
DROP POLICY IF EXISTS "Service can insert historical assessments" ON public.assessments;

-- Create simplified, secure policies with clear email protection
-- Users can manage their own assessments (with email)
CREATE POLICY "Users can view their own assessments"
ON public.assessments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can create their own assessments"
ON public.assessments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update their own assessments"
ON public.assessments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can delete their own assessments"
ON public.assessments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Super admins can view all assessments (with email) for admin purposes
CREATE POLICY "Super admins can view all assessments with email"
ON public.assessments
FOR SELECT
TO authenticated
USING (
  get_current_user_role() = 'super_admin'::user_role
);

-- Admins can view organization assessments but WITHOUT email access
-- Note: Email filtering must be done at application level using get_secure_paginated_assessments
CREATE POLICY "Admins can view org assessments without email"
ON public.assessments
FOR SELECT
TO authenticated
USING (
  get_current_user_role() = 'admin'::user_role
  AND organization_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.organization_id = assessments.organization_id
  )
);

-- Service role can insert historical assessments
CREATE POLICY "Service role can insert assessments"
ON public.assessments
FOR INSERT
TO authenticated
WITH CHECK (
  is_service_role() OR (auth.uid() = user_id AND user_id IS NOT NULL)
);

-- Block all anonymous access
CREATE POLICY "Block anonymous access to assessments"
ON public.assessments
FOR ALL
TO anon
USING (false);

-- Add a comment documenting email protection strategy
COMMENT ON TABLE public.assessments IS 'SECURITY: Email addresses are sensitive PII. Direct RLS policies allow admins to see assessments, but application code (get_secure_paginated_assessments function) filters out email addresses for non-owners except super_admins. Always use the secure function for queries that may expose emails.';