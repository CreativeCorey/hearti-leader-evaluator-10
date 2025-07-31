-- Create a separate table for historical profiles that don't require auth.users reference
CREATE TABLE public.historical_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_unique_id TEXT, -- Store the original unique ID from the import source
  is_historical BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on historical_profiles
ALTER TABLE public.historical_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for historical_profiles
CREATE POLICY "Admins can view all historical profiles" 
ON public.historical_profiles FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Service can insert historical profiles" 
ON public.historical_profiles FOR INSERT 
WITH CHECK (true);

-- Add trigger for updating updated_at
CREATE TRIGGER update_historical_profiles_updated_at
  BEFORE UPDATE ON public.historical_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Also need to allow historical assessments to reference historical profiles
-- Add a historical_profile_id column to assessments table
ALTER TABLE public.assessments 
ADD COLUMN historical_profile_id UUID REFERENCES public.historical_profiles(id) ON DELETE CASCADE;

-- Update assessments policies to handle historical profiles
CREATE POLICY "Admins can view historical assessments" 
ON public.assessments FOR SELECT 
USING (
  historical_profile_id IS NOT NULL 
  AND public.get_current_user_role() = 'admin'
);

CREATE POLICY "Service can insert historical assessments" 
ON public.assessments FOR INSERT 
WITH CHECK (historical_profile_id IS NOT NULL OR auth.uid() = user_id);