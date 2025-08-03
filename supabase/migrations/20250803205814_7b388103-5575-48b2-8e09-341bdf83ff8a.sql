-- Create a function to get paginated users from both profiles and historical_profiles tables
CREATE OR REPLACE FUNCTION public.get_paginated_users(
  page_offset integer DEFAULT 0,
  page_limit integer DEFAULT 100,
  search_term text DEFAULT NULL,
  role_filter user_role DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  name text,
  email text,
  role user_role,
  organization_id uuid,
  created_at timestamp with time zone,
  organization_name text,
  is_historical boolean,
  source_unique_id text,
  total_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  WITH combined_users AS (
    -- Get regular profiles
    SELECT 
      p.id,
      p.name,
      p.email,
      p.role,
      p.organization_id,
      p.created_at,
      o.name as organization_name,
      false as is_historical,
      NULL::text as source_unique_id
    FROM profiles p
    LEFT JOIN organizations o ON p.organization_id = o.id
    WHERE (search_term IS NULL OR p.name ILIKE '%' || search_term || '%' OR p.email ILIKE '%' || search_term || '%')
      AND (role_filter IS NULL OR p.role = role_filter)
    
    UNION ALL
    
    -- Get historical profiles
    SELECT 
      hp.id,
      hp.name,
      hp.email,
      hp.role,
      hp.organization_id,
      hp.created_at,
      o.name as organization_name,
      true as is_historical,
      hp.source_unique_id
    FROM historical_profiles hp
    LEFT JOIN organizations o ON hp.organization_id = o.id
    WHERE (search_term IS NULL OR hp.name ILIKE '%' || search_term || '%' OR hp.email ILIKE '%' || search_term || '%')
      AND (role_filter IS NULL OR hp.role = role_filter)
  ),
  user_count AS (
    SELECT COUNT(*) as total FROM combined_users
  )
  SELECT 
    cu.id,
    cu.name,
    cu.email,
    cu.role,
    cu.organization_id,
    cu.created_at,
    cu.organization_name,
    cu.is_historical,
    cu.source_unique_id,
    uc.total as total_count
  FROM combined_users cu
  CROSS JOIN user_count uc
  ORDER BY cu.created_at DESC
  LIMIT page_limit
  OFFSET page_offset;
$$;