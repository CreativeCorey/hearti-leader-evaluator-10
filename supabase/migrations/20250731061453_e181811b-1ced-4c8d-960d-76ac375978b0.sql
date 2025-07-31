-- Fix Critical Issue #3: Insecure Profile Role Assignment
-- Drop all existing problematic policies first
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authentication users only" ON public.profiles;

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
DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can read own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can delete own assessments" ON public.assessments;

-- Create secure assessment policies for authenticated users only
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

CREATE POLICY "Authenticated users can delete own assessments" 
ON public.assessments 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);