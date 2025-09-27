-- Create coaching_relationships table and auto-assignment system
CREATE TABLE IF NOT EXISTS public.coaching_relationships (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(coach_id, participant_id)
);

-- Enable RLS on coaching_relationships
ALTER TABLE public.coaching_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for coaching_relationships
CREATE POLICY "Coaches can view their relationships" ON public.coaching_relationships
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'coach' AND p.id = coach_id
  )
);

CREATE POLICY "Participants can view their relationships" ON public.coaching_relationships
FOR SELECT USING (
  auth.uid() = participant_id
);

CREATE POLICY "Coaches can manage relationships" ON public.coaching_relationships
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'coach' AND p.id = coach_id
  )
);

-- Create function to auto-assign new users to default coach
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

-- Create trigger to assign coach on new user creation
DROP TRIGGER IF EXISTS on_user_profile_created ON public.profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_default_coach();

-- Associate existing participants with default coach (when it exists)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;