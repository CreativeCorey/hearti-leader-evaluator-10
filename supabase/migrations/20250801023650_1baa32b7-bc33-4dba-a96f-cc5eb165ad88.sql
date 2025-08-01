-- Clear historical data
DELETE FROM assessments WHERE historical_profile_id IS NOT NULL;
DELETE FROM historical_profiles;