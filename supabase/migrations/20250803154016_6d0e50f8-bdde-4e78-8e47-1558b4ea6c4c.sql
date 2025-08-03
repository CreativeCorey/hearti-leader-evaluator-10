-- Update RLS policies to include super_admin role for historical data access

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all historical profiles" ON historical_profiles;
DROP POLICY IF EXISTS "Admins can view historical assessments" ON assessments;

-- Create new policies that include both admin and super_admin roles
CREATE POLICY "Admins and super admins can view all historical profiles" 
ON historical_profiles 
FOR SELECT 
USING (get_current_user_role() IN ('admin'::user_role, 'super_admin'::user_role));

CREATE POLICY "Admins and super admins can view historical assessments" 
ON assessments 
FOR SELECT 
USING (
  (historical_profile_id IS NOT NULL) 
  AND (get_current_user_role() IN ('admin'::user_role, 'super_admin'::user_role))
);