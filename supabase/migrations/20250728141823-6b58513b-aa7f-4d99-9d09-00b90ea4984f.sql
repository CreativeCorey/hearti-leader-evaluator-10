-- Make coreyjmvp@gmail.com an admin
UPDATE profiles 
SET role = 'admin'
WHERE email = 'coreyjmvp@gmail.com';

-- If profile doesn't exist, create it
INSERT INTO profiles (id, email, role, name)
SELECT 
  gen_random_uuid(),
  'coreyjmvp@gmail.com',
  'admin'::user_role,
  'Coach Admin'
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'coreyjmvp@gmail.com'
);

-- Create a messages table for coach-user communication if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'recipient_id') THEN
    ALTER TABLE messages ADD COLUMN recipient_id uuid REFERENCES auth.users(id);
    ALTER TABLE messages ADD COLUMN message_type text DEFAULT 'group';
    ALTER TABLE messages ADD COLUMN sender_role text DEFAULT 'user';
  END IF;
END $$;

-- Update RLS policies for messages
DROP POLICY IF EXISTS "Anyone can read messages" ON messages;
DROP POLICY IF EXISTS "Users can create their own messages" ON messages;

-- New RLS policies for coach messaging
CREATE POLICY "Users can read relevant messages" 
ON messages 
FOR SELECT 
USING (
  -- Group messages are visible to everyone
  message_type = 'group' 
  OR 
  -- Individual messages are visible to sender and recipient
  (message_type = 'individual' AND (auth.uid() = user_id OR auth.uid() = recipient_id))
);

CREATE POLICY "Users can create messages" 
ON messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create notifications table for habit tracker reminders
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'habit_reminder',
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  scheduled_for timestamp with time zone
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" 
ON notifications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'coach')
  )
);

CREATE POLICY "Users can update their own notifications" 
ON notifications 
FOR UPDATE 
USING (auth.uid() = user_id);