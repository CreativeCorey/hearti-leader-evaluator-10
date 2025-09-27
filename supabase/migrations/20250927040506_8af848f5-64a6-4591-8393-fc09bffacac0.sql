-- Update database functions to include explicit search_path for security
-- This addresses the Supabase linter warnings about missing search_path

-- Update prevent_role_escalation function
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only allow role changes if the user is an admin or super_admin
  IF OLD.role != NEW.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin'::user_role, 'super_admin'::user_role)
    ) THEN
      RAISE EXCEPTION 'Only admins and super admins can change user roles';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update validate_assessment_data function
CREATE OR REPLACE FUNCTION public.validate_assessment_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.validate_assessment_answers(NEW.answers) THEN
    RAISE EXCEPTION 'Invalid assessment answers format';
  END IF;
  
  IF NEW.overall_score < 1 OR NEW.overall_score > 5 THEN
    RAISE EXCEPTION 'Overall score must be between 1 and 5';
  END IF;
  
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create assessment for another user';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update validate_assessment_security function
CREATE OR REPLACE FUNCTION public.validate_assessment_security()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Update assign_default_coach function
CREATE OR REPLACE FUNCTION public.assign_default_coach()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  default_coach_id uuid;
BEGIN
  -- Only assign coach to users with 'user' role
  IF NEW.role = 'user' THEN
    -- Get the default coach ID (corey@prismwork.com)
    SELECT id INTO default_coach_id 
    FROM public.profiles 
    WHERE email = 'corey@prismwork.com' AND role = 'coach' 
    LIMIT 1;
    
    -- Insert coaching relationship if coach exists
    IF default_coach_id IS NOT NULL THEN
      INSERT INTO public.coaching_relationships (coach_id, participant_id)
      VALUES (default_coach_id, NEW.id)
      ON CONFLICT (coach_id, participant_id) DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update assign_existing_users_to_new_coach function
CREATE OR REPLACE FUNCTION public.assign_existing_users_to_new_coach()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- If this is a new coach with email corey@prismwork.com
  IF NEW.role = 'coach' AND NEW.email = 'corey@prismwork.com' THEN
    -- Assign all existing users who don't have a coach yet
    INSERT INTO public.coaching_relationships (coach_id, participant_id)
    SELECT NEW.id, p.id
    FROM public.profiles p
    WHERE p.role = 'user' 
    AND p.id NOT IN (
      SELECT cr.participant_id 
      FROM public.coaching_relationships cr 
      WHERE cr.participant_id IS NOT NULL
    )
    ON CONFLICT (coach_id, participant_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update on_assessment_created function
CREATE OR REPLACE FUNCTION public.on_assessment_created()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Generate email if missing
  IF NEW.email IS NULL THEN
    NEW.email := 'anonymous@' || substring(NEW.user_id::text, 1, 8) || '.com';
  END IF;

  -- Use proper edge function invocation without hardcoded tokens
  -- The edge function will handle its own authentication
  PERFORM net.http_post(
    url := 'https://odwkgxdkjyccnkydxvjw.supabase.co/functions/v1/sync-assessment-to-sheet',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'assessment_id', NEW.id,
      'user_id', NEW.user_id,
      'date', NEW.date,
      'overall_score', NEW.overall_score,
      'dimension_scores', NEW.dimension_scores,
      'demographics', NEW.demographics,
      'email', NEW.email,
      'trigger_source', 'database_trigger'
    )
  );
  
  RETURN NEW;
END;
$function$;