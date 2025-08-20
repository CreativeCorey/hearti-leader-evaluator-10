-- Fix function search path security warning

-- Update the is_service_role function to have a secure search path
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  -- Check if we're in a service role context by checking for service role key usage
  -- Service role bypasses RLS, so this function is mainly for explicit checks
  SELECT 
    auth.jwt() ->> 'role' = 'service_role' OR
    current_setting('role') = 'service_role' OR
    -- Additional check: if auth.uid() is NULL but we have an authenticated context
    (auth.uid() IS NULL AND current_setting('request.header.authorization', true) IS NOT NULL);
$$;