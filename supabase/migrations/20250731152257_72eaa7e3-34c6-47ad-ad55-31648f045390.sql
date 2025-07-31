-- Security Fix: Clean up all existing policies on profiles table and recreate secure ones
-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to create profiles" ON public.profiles; 
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create secure, non-overlapping RLS policies for profiles
-- Users can only view their own profile (no anonymous access)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can only insert their own profile (no anonymous access)
CREATE POLICY "Users can insert own profile"  
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can only update their own profile, but CANNOT update role field
CREATE POLICY "Users can update own profile (except role)"
ON public.profiles  
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND OLD.role = NEW.role  -- Prevent role escalation
);

-- Only admins can update user roles
CREATE POLICY "Admins can update user roles"
ON public.profiles
FOR UPDATE  
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'  
  )
);

-- Create input validation function for assessment answers
CREATE OR REPLACE FUNCTION public.validate_assessment_answers(answers jsonb)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  -- Check if answers is an array
  IF jsonb_typeof(answers) != 'array' THEN
    RETURN false;
  END IF;
  
  -- Check if all answers are integers between 1 and 5
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(answers) AS answer
    WHERE jsonb_typeof(answer) != 'number' 
    OR answer::int < 1 
    OR answer::int > 5
    OR answer::numeric != trunc(answer::numeric)
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
  -- Validate answers format
  IF NOT public.validate_assessment_answers(NEW.answers) THEN
    RAISE EXCEPTION 'Invalid assessment answers format';
  END IF;
  
  -- Validate overall score range
  IF NEW.overall_score < 1 OR NEW.overall_score > 5 THEN
    RAISE EXCEPTION 'Overall score must be between 1 and 5';
  END IF;
  
  -- Ensure user_id matches authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create assessment for another user';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the validation trigger
DROP TRIGGER IF EXISTS validate_assessment_trigger ON public.assessments;
CREATE TRIGGER validate_assessment_trigger
  BEFORE INSERT OR UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_assessment_data();