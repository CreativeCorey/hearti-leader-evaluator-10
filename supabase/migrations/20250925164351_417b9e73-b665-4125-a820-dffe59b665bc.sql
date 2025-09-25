-- Add RLS policy to allow super admins to view all assessments
CREATE POLICY "Super admins can view all assessments" 
ON public.assessments 
FOR SELECT 
USING (get_current_user_role() = 'super_admin'::user_role);

-- Add RLS policy to allow admins to view all assessments in the system (not just their org)
CREATE POLICY "Admins can view assessments for user management" 
ON public.assessments 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]));

-- Create a secure function to get user assessments that respects admin permissions
CREATE OR REPLACE FUNCTION public.get_user_assessments_secure(target_user_id uuid, is_historical_user boolean DEFAULT false)
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  historical_profile_id uuid,
  date timestamp with time zone, 
  overall_score numeric, 
  dimension_scores jsonb, 
  answers jsonb, 
  demographics jsonb, 
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has permission to view assessments
  IF NOT (
    auth.uid() = target_user_id OR -- User can see their own
    get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]) -- Admins can see all
  ) THEN
    RAISE EXCEPTION 'Insufficient permissions to view user assessments';
  END IF;

  -- Return assessments based on whether it's a historical user or not
  IF is_historical_user THEN
    RETURN QUERY
    SELECT 
      a.id,
      a.user_id,
      a.historical_profile_id,
      a.date,
      a.overall_score,
      a.dimension_scores,
      a.answers,
      a.demographics,
      a.email
    FROM assessments a
    WHERE a.historical_profile_id = target_user_id
    ORDER BY a.date DESC;
  ELSE
    RETURN QUERY
    SELECT 
      a.id,
      a.user_id,
      a.historical_profile_id,
      a.date,
      a.overall_score,
      a.dimension_scores,
      a.answers,
      a.demographics,
      a.email
    FROM assessments a
    WHERE a.user_id = target_user_id
    ORDER BY a.date DESC;
  END IF;
END;
$$;