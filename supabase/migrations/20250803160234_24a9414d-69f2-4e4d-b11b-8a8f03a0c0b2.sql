-- Update RLS policies to allow service to process larger datasets
-- We need to adjust policies to support bulk operations

-- Create a more efficient aggregation service for comparison data  
CREATE OR REPLACE FUNCTION public.get_aggregate_scores()
RETURNS TABLE(
  dimension text,
  average_score numeric,
  gender_scores jsonb,
  role_scores jsonb,
  company_size_scores jsonb,
  management_level_scores jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'humility'::text as dimension,
    AVG((dimension_scores->>'humility')::numeric) as average_score,
    jsonb_build_object(
      'men', AVG(CASE WHEN demographics->>'gender' = 'Man' THEN (dimension_scores->>'humility')::numeric END),
      'women', AVG(CASE WHEN demographics->>'gender' = 'Woman' THEN (dimension_scores->>'humility')::numeric END)
    ) as gender_scores,
    jsonb_build_object(
      'Engineering', AVG(CASE WHEN demographics->>'jobRole' ILIKE '%engineering%' THEN (dimension_scores->>'humility')::numeric END),
      'Management', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'humility')::numeric END),
      'C-Suite', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'humility')::numeric END)
    ) as role_scores,
    jsonb_build_object(
      'Small', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1-50%' OR demographics->>'companySize' ILIKE '%1-250%' THEN (dimension_scores->>'humility')::numeric END),
      'Medium', AVG(CASE WHEN demographics->>'companySize' ILIKE '%51-250%' OR demographics->>'companySize' ILIKE '%251-2,500%' THEN (dimension_scores->>'humility')::numeric END),
      'Large', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1000%' OR demographics->>'companySize' ILIKE '%2,501%' THEN (dimension_scores->>'humility')::numeric END)
    ) as company_size_scores,
    jsonb_build_object(
      'Individual Contributor', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%individual%' THEN (dimension_scores->>'humility')::numeric END),
      'Manager', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'humility')::numeric END),
      'Executive', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%executive%' OR demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'humility')::numeric END)
    ) as management_level_scores
  FROM assessments 
  WHERE dimension_scores IS NOT NULL 
    AND dimension_scores->>'humility' IS NOT NULL

  UNION ALL

  SELECT 
    'empathy'::text as dimension,
    AVG((dimension_scores->>'empathy')::numeric) as average_score,
    jsonb_build_object(
      'men', AVG(CASE WHEN demographics->>'gender' = 'Man' THEN (dimension_scores->>'empathy')::numeric END),
      'women', AVG(CASE WHEN demographics->>'gender' = 'Woman' THEN (dimension_scores->>'empathy')::numeric END)
    ) as gender_scores,
    jsonb_build_object(
      'Engineering', AVG(CASE WHEN demographics->>'jobRole' ILIKE '%engineering%' THEN (dimension_scores->>'empathy')::numeric END),
      'Management', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'empathy')::numeric END),
      'C-Suite', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'empathy')::numeric END)
    ) as role_scores,
    jsonb_build_object(
      'Small', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1-50%' OR demographics->>'companySize' ILIKE '%1-250%' THEN (dimension_scores->>'empathy')::numeric END),
      'Medium', AVG(CASE WHEN demographics->>'companySize' ILIKE '%51-250%' OR demographics->>'companySize' ILIKE '%251-2,500%' THEN (dimension_scores->>'empathy')::numeric END),
      'Large', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1000%' OR demographics->>'companySize' ILIKE '%2,501%' THEN (dimension_scores->>'empathy')::numeric END)
    ) as company_size_scores,
    jsonb_build_object(
      'Individual Contributor', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%individual%' THEN (dimension_scores->>'empathy')::numeric END),
      'Manager', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'empathy')::numeric END),
      'Executive', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%executive%' OR demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'empathy')::numeric END)
    ) as management_level_scores
  FROM assessments 
  WHERE dimension_scores IS NOT NULL 
    AND dimension_scores->>'empathy' IS NOT NULL

  UNION ALL

  SELECT 
    'accountability'::text as dimension,
    AVG((dimension_scores->>'accountability')::numeric) as average_score,
    jsonb_build_object(
      'men', AVG(CASE WHEN demographics->>'gender' = 'Man' THEN (dimension_scores->>'accountability')::numeric END),
      'women', AVG(CASE WHEN demographics->>'gender' = 'Woman' THEN (dimension_scores->>'accountability')::numeric END)
    ) as gender_scores,
    jsonb_build_object(
      'Engineering', AVG(CASE WHEN demographics->>'jobRole' ILIKE '%engineering%' THEN (dimension_scores->>'accountability')::numeric END),
      'Management', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'accountability')::numeric END),
      'C-Suite', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'accountability')::numeric END)
    ) as role_scores,
    jsonb_build_object(
      'Small', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1-50%' OR demographics->>'companySize' ILIKE '%1-250%' THEN (dimension_scores->>'accountability')::numeric END),
      'Medium', AVG(CASE WHEN demographics->>'companySize' ILIKE '%51-250%' OR demographics->>'companySize' ILIKE '%251-2,500%' THEN (dimension_scores->>'accountability')::numeric END),
      'Large', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1000%' OR demographics->>'companySize' ILIKE '%2,501%' THEN (dimension_scores->>'accountability')::numeric END)
    ) as company_size_scores,
    jsonb_build_object(
      'Individual Contributor', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%individual%' THEN (dimension_scores->>'accountability')::numeric END),
      'Manager', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'accountability')::numeric END),
      'Executive', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%executive%' OR demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'accountability')::numeric END)
    ) as management_level_scores
  FROM assessments 
  WHERE dimension_scores IS NOT NULL 
    AND dimension_scores->>'accountability' IS NOT NULL

  UNION ALL

  SELECT 
    'resiliency'::text as dimension,
    AVG((dimension_scores->>'resiliency')::numeric) as average_score,
    jsonb_build_object(
      'men', AVG(CASE WHEN demographics->>'gender' = 'Man' THEN (dimension_scores->>'resiliency')::numeric END),
      'women', AVG(CASE WHEN demographics->>'gender' = 'Woman' THEN (dimension_scores->>'resiliency')::numeric END)
    ) as gender_scores,
    jsonb_build_object(
      'Engineering', AVG(CASE WHEN demographics->>'jobRole' ILIKE '%engineering%' THEN (dimension_scores->>'resiliency')::numeric END),
      'Management', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'resiliency')::numeric END),
      'C-Suite', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'resiliency')::numeric END)
    ) as role_scores,
    jsonb_build_object(
      'Small', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1-50%' OR demographics->>'companySize' ILIKE '%1-250%' THEN (dimension_scores->>'resiliency')::numeric END),
      'Medium', AVG(CASE WHEN demographics->>'companySize' ILIKE '%51-250%' OR demographics->>'companySize' ILIKE '%251-2,500%' THEN (dimension_scores->>'resiliency')::numeric END),
      'Large', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1000%' OR demographics->>'companySize' ILIKE '%2,501%' THEN (dimension_scores->>'resiliency')::numeric END)
    ) as company_size_scores,
    jsonb_build_object(
      'Individual Contributor', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%individual%' THEN (dimension_scores->>'resiliency')::numeric END),
      'Manager', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'resiliency')::numeric END),
      'Executive', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%executive%' OR demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'resiliency')::numeric END)
    ) as management_level_scores
  FROM assessments 
  WHERE dimension_scores IS NOT NULL 
    AND dimension_scores->>'resiliency' IS NOT NULL

  UNION ALL

  SELECT 
    'transparency'::text as dimension,
    AVG((dimension_scores->>'transparency')::numeric) as average_score,
    jsonb_build_object(
      'men', AVG(CASE WHEN demographics->>'gender' = 'Man' THEN (dimension_scores->>'transparency')::numeric END),
      'women', AVG(CASE WHEN demographics->>'gender' = 'Woman' THEN (dimension_scores->>'transparency')::numeric END)
    ) as gender_scores,
    jsonb_build_object(
      'Engineering', AVG(CASE WHEN demographics->>'jobRole' ILIKE '%engineering%' THEN (dimension_scores->>'transparency')::numeric END),
      'Management', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'transparency')::numeric END),
      'C-Suite', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'transparency')::numeric END)
    ) as role_scores,
    jsonb_build_object(
      'Small', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1-50%' OR demographics->>'companySize' ILIKE '%1-250%' THEN (dimension_scores->>'transparency')::numeric END),
      'Medium', AVG(CASE WHEN demographics->>'companySize' ILIKE '%51-250%' OR demographics->>'companySize' ILIKE '%251-2,500%' THEN (dimension_scores->>'transparency')::numeric END),
      'Large', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1000%' OR demographics->>'companySize' ILIKE '%2,501%' THEN (dimension_scores->>'transparency')::numeric END)
    ) as company_size_scores,
    jsonb_build_object(
      'Individual Contributor', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%individual%' THEN (dimension_scores->>'transparency')::numeric END),
      'Manager', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'transparency')::numeric END),
      'Executive', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%executive%' OR demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'transparency')::numeric END)
    ) as management_level_scores
  FROM assessments 
  WHERE dimension_scores IS NOT NULL 
    AND dimension_scores->>'transparency' IS NOT NULL

  UNION ALL

  SELECT 
    'inclusivity'::text as dimension,
    AVG((dimension_scores->>'inclusivity')::numeric) as average_score,
    jsonb_build_object(
      'men', AVG(CASE WHEN demographics->>'gender' = 'Man' THEN (dimension_scores->>'inclusivity')::numeric END),
      'women', AVG(CASE WHEN demographics->>'gender' = 'Woman' THEN (dimension_scores->>'inclusivity')::numeric END)
    ) as gender_scores,
    jsonb_build_object(
      'Engineering', AVG(CASE WHEN demographics->>'jobRole' ILIKE '%engineering%' THEN (dimension_scores->>'inclusivity')::numeric END),
      'Management', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'inclusivity')::numeric END),
      'C-Suite', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'inclusivity')::numeric END)
    ) as role_scores,
    jsonb_build_object(
      'Small', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1-50%' OR demographics->>'companySize' ILIKE '%1-250%' THEN (dimension_scores->>'inclusivity')::numeric END),
      'Medium', AVG(CASE WHEN demographics->>'companySize' ILIKE '%51-250%' OR demographics->>'companySize' ILIKE '%251-2,500%' THEN (dimension_scores->>'inclusivity')::numeric END),
      'Large', AVG(CASE WHEN demographics->>'companySize' ILIKE '%1000%' OR demographics->>'companySize' ILIKE '%2,501%' THEN (dimension_scores->>'inclusivity')::numeric END)
    ) as company_size_scores,
    jsonb_build_object(
      'Individual Contributor', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%individual%' THEN (dimension_scores->>'inclusivity')::numeric END),
      'Manager', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%manager%' THEN (dimension_scores->>'inclusivity')::numeric END),
      'Executive', AVG(CASE WHEN demographics->>'managementLevel' ILIKE '%executive%' OR demographics->>'managementLevel' ILIKE '%c-suite%' THEN (dimension_scores->>'inclusivity')::numeric END)
    ) as management_level_scores
  FROM assessments 
  WHERE dimension_scores IS NOT NULL 
    AND dimension_scores->>'inclusivity' IS NOT NULL;
END;
$$;