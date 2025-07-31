-- COMPREHENSIVE SECURITY FIXES

-- 1. Fix conflicting RLS policies on assessments table
-- Remove overly permissive policies that conflict with auth-only access
DROP POLICY IF EXISTS "Allow users to create assessments" ON public.assessments;
DROP POLICY IF EXISTS "Allow users to read assessments" ON public.assessments;
DROP POLICY IF EXISTS "Allow users to update their own assessments" ON public.assessments;

-- 2. Fix habits table to use proper auth instead of anonymous headers
-- Remove policies that rely on spoofable headers
DROP POLICY IF EXISTS "Users can create their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;

-- Change habits table user_id column to UUID type for proper auth
ALTER TABLE public.habits ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Create secure RLS policies for habits that use proper authentication
CREATE POLICY "Authenticated users can create their own habits" 
ON public.habits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own habits" 
ON public.habits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own habits" 
ON public.habits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own habits" 
ON public.habits 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Fix overly permissive organization policies
-- Remove public read access and unrestricted creation
DROP POLICY IF EXISTS "Everyone can read organizations" ON public.organizations;
DROP POLICY IF EXISTS "Anyone can create an organization" ON public.organizations;

-- Create secure organization policies
CREATE POLICY "Authenticated users can view organizations" 
ON public.organizations 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Fix the database function with hardcoded bearer token
-- Update the trigger function to use proper authentication
CREATE OR REPLACE FUNCTION public.on_assessment_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Generate email if missing
  IF NEW.email IS NULL THEN
    NEW.email := 'anonymous@' || substring(NEW.user_id::text, 1, 8) || '.com';
  END IF;

  -- Use proper edge function invocation without hardcoded tokens
  -- The edge function will handle its own authentication
  PERFORM net.http_post(
    url := 'https://odwkgxdkjyccnkydxvjw.supabase.co/functions/v1/sync-assessment-to-sheet',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
      -- Removed hardcoded Authorization header for security
    ),
    body := jsonb_build_object(
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
$$;

-- 5. Create saved_activities table with proper security
CREATE TABLE IF NOT EXISTS public.saved_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  activity_id text NOT NULL,
  dimension text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  saved_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on saved_activities
ALTER TABLE public.saved_activities ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for saved_activities
CREATE POLICY "Users can view their own saved activities" 
ON public.saved_activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved activities" 
ON public.saved_activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved activities" 
ON public.saved_activities 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved activities" 
ON public.saved_activities 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_saved_activities_updated_at
BEFORE UPDATE ON public.saved_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();