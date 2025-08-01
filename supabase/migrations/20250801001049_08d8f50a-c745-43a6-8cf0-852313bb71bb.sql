-- Remove test data for John Doe and Jane Smith
DELETE FROM assessments WHERE historical_profile_id IN (
  SELECT id FROM historical_profiles 
  WHERE email IN ('test@example.com', 'jane@example.com')
);

DELETE FROM historical_profiles 
WHERE email IN ('test@example.com', 'jane@example.com');