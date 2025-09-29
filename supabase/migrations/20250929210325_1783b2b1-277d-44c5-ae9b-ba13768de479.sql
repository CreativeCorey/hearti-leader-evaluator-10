-- Strengthen RLS policies on profiles table to explicitly block unauthenticated access
-- and prevent email harvesting attacks

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile data" ON public.profiles;

-- Create new, more restrictive policies with explicit authentication checks

-- SELECT policy: Only authenticated users can view their own profile
CREATE POLICY "Authenticated users can view own profile only"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = id
);

-- INSERT policy: Only authenticated users can create their own profile
CREATE POLICY "Authenticated users can insert own profile only"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = id
);

-- UPDATE policy: Only authenticated users can update their own profile
-- Also prevent changing the id or email to maintain data integrity
CREATE POLICY "Authenticated users can update own profile only"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = id
)
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = id
);

-- Explicitly block all unauthenticated access
-- This is redundant with RLS defaults but makes intent clear
CREATE POLICY "Block all unauthenticated access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- Add comment for documentation
COMMENT ON TABLE public.profiles IS 'User profiles table with strict RLS. Only authenticated users can access their own data. Unauthenticated access is explicitly blocked to prevent email harvesting.';