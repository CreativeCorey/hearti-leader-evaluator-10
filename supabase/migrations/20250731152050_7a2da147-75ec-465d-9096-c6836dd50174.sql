-- Security Fix 1: Remove anonymous access from profiles table
-- Drop the problematic policies that allow anonymous access
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read profiles" ON public.profiles;

-- Security Fix 2: Create secure, non-overlapping RLS policies for profiles
-- Users can only view their own profile and public profile data
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
  AND OLD.role = NEW.role  -- Prevent role changes
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

-- Security Fix 3: Create input validation function for assessment answers
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

-- Security Fix 4: Add validation trigger for assessments
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

-- Security Fix 5: Add rate limiting table for API calls
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only users can see their own rate limit records
CREATE POLICY "Users can view own rate limits"
ON public.rate_limits
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert rate limit records
CREATE POLICY "System can insert rate limits"
ON public.rate_limits
FOR INSERT
WITH CHECK (true);

-- Create rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_action_type text,
  p_max_requests integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  window_start timestamp with time zone;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean up old records
  DELETE FROM public.rate_limits 
  WHERE user_id = p_user_id 
  AND action_type = p_action_type 
  AND window_start < (now() - (p_window_minutes || ' minutes')::interval);
  
  -- Check current count within window
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM public.rate_limits
  WHERE user_id = p_user_id
  AND action_type = p_action_type
  AND window_start >= (now() - (p_window_minutes || ' minutes')::interval);
  
  -- If under limit, increment counter
  IF current_count < p_max_requests THEN
    INSERT INTO public.rate_limits (user_id, action_type, count, window_start)
    VALUES (p_user_id, p_action_type, 1, now())
    ON CONFLICT DO NOTHING;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;