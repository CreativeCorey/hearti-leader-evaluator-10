-- Phase 1: Critical Database Security Fixes

-- 1. Add missing foreign key relationship between profiles and organizations
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_organization 
FOREIGN KEY (organization_id) 
REFERENCES public.organizations(id) 
ON DELETE SET NULL;

-- 2. Create dedicated schema for extensions and move them
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move commonly used extensions to dedicated schema
-- (Note: This should be done by database admin if extensions exist in public schema)

-- 3. Add indexes for better performance and security
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessments_organization_id ON public.assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);

-- 4. Add constraints for data integrity
ALTER TABLE public.profiles 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 5. Enhance validation trigger for assessments
CREATE OR REPLACE FUNCTION public.validate_assessment_security()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate user_id matches authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create assessment for another user';
  END IF;
  
  -- Validate organization_id if provided
  IF NEW.organization_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.organization_id = NEW.organization_id
    ) THEN
      RAISE EXCEPTION 'Invalid organization for user';
    END IF;
  END IF;
  
  -- Validate assessment data integrity
  IF NOT public.validate_assessment_answers(NEW.answers) THEN
    RAISE EXCEPTION 'Invalid assessment answers format';
  END IF;
  
  IF NEW.overall_score < 1 OR NEW.overall_score > 5 THEN
    RAISE EXCEPTION 'Overall score must be between 1 and 5';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for assessment security validation
DROP TRIGGER IF EXISTS trigger_validate_assessment_security ON public.assessments;
CREATE TRIGGER trigger_validate_assessment_security
  BEFORE INSERT OR UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.validate_assessment_security();