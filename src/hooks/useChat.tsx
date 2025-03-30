
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchMessages, subscribeToMessages } from '@/utils/supabase/messages';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string;
  created_at: string;
}

export function useChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState(0);
  const [activeTab, setActiveTab] = useState('group');

  // Load initial messages
  useEffect(() => {
    let isMounted = true;
    
    const loadMessages = async () => {
      try {
        setLoading(true);
        
        // Get messages from Supabase
        const { data, error } = await fetchMessages(50);
          
        if (error) {
          console.error('Error loading messages:', error);
          if (isMounted) {
            toast({
              title: 'Error loading messages',
              description: error.message,
              variant: 'destructive',
            });
          }
          return;
        }
        
        // Count unique participants
        if (data && isMounted) {
          const uniqueUsers = new Set(data.map(msg => msg.user_id));
          setParticipants(uniqueUsers.size);
          setMessages(data || []);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadMessages();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);
  
  // Set up real-time subscription
  useEffect(() => {
    // Create a channel
    const channel = subscribeToMessages((newMessage) => {
      setMessages((current) => {
        // Add message if not already in the list
        if (!current.some(msg => msg.id === newMessage.id)) {
          // Update participant count if this is a new user
          const userExists = current.some(msg => msg.user_id === newMessage.user_id);
          if (!userExists) {
            setParticipants(prev => prev + 1);
          }
          return [...current, newMessage];
        }
        return current;
      });
    });
    
    // Clean up subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { 
    messages, 
    loading, 
    participants, 
    activeTab, 
    setActiveTab 
  };
}
