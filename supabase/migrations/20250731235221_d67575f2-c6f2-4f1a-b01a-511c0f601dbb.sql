-- Fix the assessments table to properly handle historical assessments
-- Make user_id nullable for historical assessments
ALTER TABLE public.assessments ALTER COLUMN user_id DROP NOT NULL;

-- Add a constraint to ensure either user_id or historical_profile_id is provided
ALTER TABLE public.assessments 
ADD CONSTRAINT assessments_user_check 
CHECK (
  (user_id IS NOT NULL AND historical_profile_id IS NULL) OR 
  (user_id IS NULL AND historical_profile_id IS NOT NULL)
);