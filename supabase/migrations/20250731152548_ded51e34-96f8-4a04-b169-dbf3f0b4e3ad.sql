-- Security Fix: Clean up existing policies and create secure ones
-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to create profiles" ON public.profiles; 
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create secure RLS policies for profiles
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"  
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile data (but not role)
CREATE POLICY "Users can update own profile data"
ON public.profiles  
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add a trigger to prevent role escalation
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
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

-- Create trigger to prevent role escalation
DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_role_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- Create input validation function for assessment answers
CREATE OR REPLACE FUNCTION public.validate_assessment_answers(answers jsonb)
RETURNS boolean
LANGUAGE plpgsql
STABLE
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

-- Add validation trigger for assessments
CREATE OR REPLACE FUNCTION public.validate_assessment_data()
RETURNS trigger
LANGUAGE plpgsql
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

DROP TRIGGER IF EXISTS validate_assessment_trigger ON public.assessments;
CREATE TRIGGER validate_assessment_trigger
  BEFORE INSERT OR UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_assessment_data();