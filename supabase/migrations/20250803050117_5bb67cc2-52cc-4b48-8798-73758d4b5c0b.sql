-- Now that super_admin enum value is committed, we can use it

-- Update the user coreyjmvp@gmail.com to super_admin role
UPDATE public.profiles 
SET role = 'super_admin'::user_role
WHERE email = 'coreyjmvp@gmail.com';

-- Create a function to allow super_admin to promote users to admin
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if the current user is a super_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'super_admin'::user_role
  ) THEN
    RAISE EXCEPTION 'Only super admins can promote users to admin';
  END IF;
  
  -- Update the target user's role to admin
  UPDATE public.profiles 
  SET role = 'admin'::user_role
  WHERE id = target_user_id;
  
  RETURN FOUND;
END;
$$;

-- Update the get_current_user_role function to handle super_admin
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'user'::user_role
  );
$$;

-- Update the RLS policy to allow super_admin to update user roles
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;