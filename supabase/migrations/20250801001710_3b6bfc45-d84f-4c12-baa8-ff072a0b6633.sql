-- Clean up duplicate assessments and incorrect scores
-- First, delete all historical assessments that have dimension scores of 3.0 for all dimensions
DELETE FROM assessments 
WHERE historical_profile_id IS NOT NULL 
AND (dimension_scores->>'humility')::float = 3.0 
AND (dimension_scores->>'empathy')::float = 3.0 
AND (dimension_scores->>'accountability')::float = 3.0 
AND (dimension_scores->>'resiliency')::float = 3.0 
AND (dimension_scores->>'transparency')::float = 3.0 
AND (dimension_scores->>'inclusivity')::float = 3.0;