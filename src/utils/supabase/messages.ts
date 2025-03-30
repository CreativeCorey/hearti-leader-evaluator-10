
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string;
  created_at: string;
}

/**
 * Fetch recent messages from the database
 */
export const fetchMessages = async (limit = 50) => {
  return await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(limit);
};

/**
 * Send a new message to the group chat
 */
export const sendMessage = async (content: string, username: string, userId: string) => {
  return await supabase.from('messages').insert({
    content: content.trim(),
    user_id: userId,
    username,
  });
};

/**
 * Subscribe to new messages in real-time
 */
export const subscribeToMessages = (callback: (message: Message) => void) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      (payload) => {
        const newMessage = payload.new as Message;
        callback(newMessage);
      }
    )
    .subscribe();
    
  return channel;
};
