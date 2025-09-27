-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.assign_default_coach()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.associate_existing_participants_with_coach(coach_email text)
RETURNS integer AS $$
DECLARE
  default_coach_id uuid;
  associations_created integer := 0;
BEGIN
  -- Get the coach ID
  SELECT id INTO default_coach_id 
  FROM public.profiles 
  WHERE email = coach_email AND role = 'coach' 
  LIMIT 1;
  
  -- If coach exists, associate all unassigned users
  IF default_coach_id IS NOT NULL THEN
    WITH existing_participants AS (
      SELECT id FROM public.profiles 
      WHERE role = 'user' 
      AND id NOT IN (
        SELECT participant_id FROM public.coaching_relationships
      )
    )
    INSERT INTO public.coaching_relationships (coach_id, participant_id)
    SELECT default_coach_id, ep.id
    FROM existing_participants ep;
    
    GET DIAGNOSTICS associations_created = ROW_COUNT;
  END IF;
  
  RETURN associations_created;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;