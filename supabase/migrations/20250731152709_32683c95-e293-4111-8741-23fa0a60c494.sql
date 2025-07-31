-- Fix security warnings: Set search_path for functions
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
STABLE
SECURITY DEFINER
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