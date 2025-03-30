
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const isMountedRef = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const initializationCompleted = useRef(false);

  // Load initial messages - only run once
  useEffect(() => {
    // Prevent duplicate initialization
    if (initializationCompleted.current) {
      return;
    }
    
    initializationCompleted.current = true;
    
    const loadMessages = async () => {
      try {
        setLoading(true);
        
        // Get messages from Supabase
        const { data, error } = await fetchMessages(50);
          
        if (error) {
          console.error('Error loading messages:', error);
          if (isMountedRef.current) {
            toast({
              title: 'Error loading messages',
              description: error.message,
              variant: 'destructive',
            });
          }
          return;
        }
        
        // Count unique participants
        if (data && isMountedRef.current) {
          const uniqueUsers = new Set(data.map(msg => msg.user_id));
          setParticipants(uniqueUsers.size);
          setMessages(data || []);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };
    
    loadMessages();
  }, [toast]); // Only depend on toast to prevent re-runs
  
  // Set up real-time subscription
  useEffect(() => {
    // Create a channel only if not already created
    if (!channelRef.current && isMountedRef.current) {
      channelRef.current = subscribeToMessages((newMessage) => {
        if (isMountedRef.current) {
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
        }
      });
    }
    
    // Clean up subscription on unmount
    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        // Properly remove channel using supabase.removeChannel
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      // Reset the initialization flag when component unmounts
      initializationCompleted.current = false;
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
