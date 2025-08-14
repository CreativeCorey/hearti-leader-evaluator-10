-- Fix security vulnerability: Group messages visible to all users
-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Users can read relevant messages" ON public.messages;

-- Create a new secure policy that removes unrestricted group message access
CREATE POLICY "Users can read secure messages" ON public.messages
FOR SELECT 
USING (
  -- Individual messages: only sender or recipient can read
  (message_type = 'individual' AND (auth.uid() = user_id OR auth.uid() = recipient_id))
  OR
  -- Broadcast messages: only from admins, readable by all authenticated users
  (message_type = 'broadcast' AND sender_role = 'admin')
  OR
  -- Organization messages: only organization members can read
  (message_type = 'organization' AND organization_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() AND p.organization_id = messages.organization_id
  ))
  -- NOTE: Group messages are temporarily disabled until proper group membership system is implemented
);

-- Also update the insert policy to be more restrictive
DROP POLICY IF EXISTS "Users can create messages" ON public.messages;

CREATE POLICY "Users can create secure messages" ON public.messages
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  (
    -- Individual messages
    message_type = 'individual'
    OR
    -- Broadcast messages: only admins can send
    (message_type = 'broadcast' AND EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.role = 'admin'
    ))
    OR
    -- Organization messages: only organization members can send
    (message_type = 'organization' AND organization_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM profiles p 
      WHERE p.id = auth.uid() AND p.organization_id = organization_id
    ))
    -- NOTE: Group messages are temporarily disabled until proper group membership system is implemented
  )
);