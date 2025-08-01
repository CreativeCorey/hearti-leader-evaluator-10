-- Clean up all imported historical data for fresh import

-- First, delete all assessments that are linked to historical profiles
DELETE FROM public.assessments 
WHERE historical_profile_id IS NOT NULL;

-- Then delete all historical profiles
DELETE FROM public.historical_profiles;