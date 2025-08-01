-- Clear all historical data using direct SQL
-- First delete historical assessments to avoid foreign key issues
DELETE FROM assessments WHERE historical_profile_id IS NOT NULL;

-- Then delete all historical profiles
DELETE FROM historical_profiles WHERE is_historical = true;