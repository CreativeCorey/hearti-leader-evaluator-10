-- For now, let's just ensure admins and super_admins can see assessment data
-- We'll handle coach role separately later if needed

-- Update the secure function to work with existing roles
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
    get_current_user_role() = ANY (ARRAY['admin'::user_role, 'super_admin'::user_role]) -- Admins and super_admins can see all
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