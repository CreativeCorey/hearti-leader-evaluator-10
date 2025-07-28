-- First, get the user ID for coreyjmvp@gmail.com from auth.users
-- Then create a profile with admin role

INSERT INTO public.profiles (
  id, 
  email, 
  name, 
  role, 
  created_at, 
  updated_at
)
SELECT 
  u.id,
  'coreyjmvp@gmail.com',
  'Corey Admin',
  'admin'::user_role,
  now(),
  now()
FROM auth.users u
WHERE u.email = 'coreyjmvp@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin'::user_role,
  updated_at = now();