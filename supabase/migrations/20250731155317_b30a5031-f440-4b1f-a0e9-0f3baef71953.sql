-- Fix remaining security linter issues

-- 1. Fix Function Search Path Mutable issue - set search_path for all functions
CREATE OR REPLACE FUNCTION public.validate_assessment_security()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = 'public'
AS $$
BEGIN
  -- Validate user_id matches authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create assessment for another user';
  END IF;
  
  -- Validate organization_id if provided
  IF NEW.organization_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.organization_id = NEW.organization_id
    ) THEN
      RAISE EXCEPTION 'Invalid organization for user';
    END IF;
  END IF;
  
  -- Validate assessment data integrity
  IF NOT public.validate_assessment_answers(NEW.answers) THEN
    RAISE EXCEPTION 'Invalid assessment answers format';
  END IF;
  
  IF NEW.overall_score < 1 OR NEW.overall_score > 5 THEN
    RAISE EXCEPTION 'Overall score must be between 1 and 5';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update other functions to have proper search_path
CREATE OR REPLACE FUNCTION public.is_authenticated_user(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT user_uuid IS NOT NULL AND user_uuid != '00000000-0000-0000-0000-000000000000'::uuid;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'::user_role
  );
$$;

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow role changes if the user is an admin
  IF OLD.role != NEW.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Only admins can change user roles';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_assessment_answers(answers jsonb)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF answers IS NULL OR jsonb_typeof(answers) != 'array' THEN
    RETURN false;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(answers) AS answer
    WHERE jsonb_typeof(answer) != 'number' 
    OR answer::int < 1 
    OR answer::int > 5
  ) THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_assessment_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT public.validate_assessment_answers(NEW.answers) THEN
    RAISE EXCEPTION 'Invalid assessment answers format';
  END IF;
  
  IF NEW.overall_score < 1 OR NEW.overall_score > 5 THEN
    RAISE EXCEPTION 'Overall score must be between 1 and 5';
  END IF;
  
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create assessment for another user';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_organization_assessments(org_id uuid)
RETURNS SETOF assessments
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT a.* 
  FROM assessments a
  JOIN profiles p ON p.id = auth.uid()
  WHERE 
    (p.organization_id = org_id AND p.role = 'admin' AND a.organization_id = org_id) 
    OR 
    (a.user_id = auth.uid() AND a.organization_id = org_id);
$$;

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