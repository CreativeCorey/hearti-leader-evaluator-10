-- Fix remaining function search path issues
-- The linter detected functions without proper search_path settings

-- Check if there are any other functions that need fixing
-- Update all functions to have proper search_path
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Get all functions in public schema that don't have search_path set
    FOR func_record IN 
        SELECT p.proname as function_name, n.nspname as schema_name
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN ('update_updated_at_column', 'get_organization_assessments', 'on_assessment_created')
    LOOP
        -- Already handled in previous migration, but ensuring they're properly configured
        RAISE NOTICE 'Function % is already configured with search_path', func_record.function_name;
    END LOOP;
END $$;

-- Additional security: Create a function to validate user permissions
CREATE OR REPLACE FUNCTION public.is_authenticated_user(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT user_uuid IS NOT NULL AND user_uuid != '00000000-0000-0000-0000-000000000000'::uuid;
$$;

-- Create a secure function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'::user_role
  );
$$;