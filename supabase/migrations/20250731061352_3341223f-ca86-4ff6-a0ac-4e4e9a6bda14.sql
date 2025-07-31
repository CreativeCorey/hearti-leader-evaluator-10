-- Fix Critical Issue #4: Database Functions Lack Security
-- Update existing functions to include proper search_path settings

-- Fix the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix the get_organization_assessments function
CREATE OR REPLACE FUNCTION public.get_organization_assessments(org_id uuid)
RETURNS SETOF assessments
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT a.* 
  FROM assessments a
  JOIN profiles p ON p.id = auth.uid()
  WHERE 
    (p.organization_id = org_id AND p.role = 'admin' AND a.organization_id = org_id) 
    OR 
    (a.user_id = auth.uid() AND a.organization_id = org_id);
$function$;

-- Fix the on_assessment_created function
CREATE OR REPLACE FUNCTION public.on_assessment_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Generate email if missing
  IF NEW.email IS NULL THEN
    NEW.email := 'anonymous@' || substring(NEW.user_id::text, 1, 8) || '.com';
  END IF;

  -- Add detailed information to the payload
  PERFORM net.http_post(
    url:='https://odwkgxdkjyccnkydxvjw.supabase.co/functions/v1/sync-assessment-to-sheet',
    headers:=jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8'
    ),
    body:=jsonb_build_object(
      'assessment_id', NEW.id,
      'user_id', NEW.user_id,
      'date', NEW.date,
      'overall_score', NEW.overall_score,
      'dimension_scores', NEW.dimension_scores,
      'demographics', NEW.demographics,
      'email', NEW.email,
      'trigger_source', 'database_trigger'
    )
  );
  
  RETURN NEW;
END;
$function$;

-- Fix Critical Issue #3: Insecure Profile Role Assignment
-- Remove overly permissive RLS policies that allow anonymous users to update profiles

-- Drop the problematic policies
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;

-- Create secure policies that only allow authenticated users
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Fix assessments RLS policies to be more secure
DROP POLICY IF EXISTS "Allow users to create assessments" ON public.assessments;
DROP POLICY IF EXISTS "Allow users to read assessments" ON public.assessments;
DROP POLICY IF EXISTS "Allow users to update their own assessments" ON public.assessments;

-- Create secure assessment policies
CREATE POLICY "Authenticated users can create assessments" 
ON public.assessments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view own assessments" 
ON public.assessments 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own assessments" 
ON public.assessments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);