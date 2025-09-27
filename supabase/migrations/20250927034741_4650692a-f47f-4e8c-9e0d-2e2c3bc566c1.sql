-- Update functions to use corey@prismwork.com as default coach
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to assign existing users to coach when coach signs up
CREATE OR REPLACE FUNCTION public.assign_existing_users_to_new_coach()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
DROP TRIGGER IF EXISTS on_user_profile_created ON public.profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_coach();

DROP TRIGGER IF EXISTS on_coach_profile_created ON public.profiles;  
CREATE TRIGGER on_coach_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_existing_users_to_new_coach();