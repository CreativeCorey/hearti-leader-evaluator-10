-- Update Supabase configuration to allow more rows in API responses
-- This change needs to be made in the config.toml file, but since we can't directly modify that,
-- we'll create a database function to handle large dataset pagination instead

-- Create a function to get paginated assessments for better data handling
CREATE OR REPLACE FUNCTION public.get_paginated_assessments(
  page_offset integer DEFAULT 0,
  page_limit integer DEFAULT 1000,
  organization_filter uuid DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  organization_id uuid,
  date timestamp with time zone,
  overall_score numeric,
  answers jsonb,
  dimension_scores jsonb,
  demographics jsonb,
  historical_profile_id uuid,
  email text,
  total_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH filtered_assessments AS (
    SELECT a.*
    FROM assessments a
    WHERE (organization_filter IS NULL OR a.organization_id = organization_filter)
    AND (
      -- User can see their own assessments
      a.user_id = auth.uid()
      OR
      -- Admins can see org assessments
      EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = auth.uid() 
        AND p.role IN ('admin', 'super_admin')
        AND (organization_filter IS NULL OR p.organization_id = a.organization_id)
      )
      OR
      -- Super admins can see historical assessments
      (a.historical_profile_id IS NOT NULL AND get_current_user_role() = 'super_admin')
    )
  ),
  assessment_count AS (
    SELECT COUNT(*) as total FROM filtered_assessments
  )
  SELECT 
    fa.*,
    ac.total as total_count
  FROM filtered_assessments fa
  CROSS JOIN assessment_count ac
  ORDER BY fa.date DESC
  LIMIT page_limit
  OFFSET page_offset;
$$;