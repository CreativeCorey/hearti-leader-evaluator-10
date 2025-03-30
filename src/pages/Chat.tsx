
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatHeader from '@/components/chat/ChatHeader';

interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string;
  created_at: string;
}

const ChatPage = () => {
  const { user, anonymousMode } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(50);
          
        if (error) {
          console.error('Error loading messages:', error);
          toast({
            title: 'Error loading messages',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        setMessages(data || []);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
        // Scroll to bottom after initial load
        setTimeout(scrollToBottom, 100);
      }
    };
    
    loadMessages();
  }, [toast]);
  
  // Set up real-time subscription
  useEffect(() => {
    // Subscribe to new messages
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
          setMessages((current) => [...current, newMessage]);
          // Scroll to bottom when new message arrives
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be signed in to send messages',
        variant: 'destructive',
      });
      return;
    }
    
    setSending(true);
    
    try {
      const { error } = await supabase.from('messages').insert({
        content: newMessage.trim(),
        user_id: user.id,
        username: user.user_metadata?.name || user.email || 'Anonymous User',
      });
      
      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error sending message',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      // Clear input field after sending
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };
  
  // Handle enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid new line
      handleSendMessage();
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Card className="shadow-md h-[80vh] flex flex-col">
        <ChatHeader />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">No messages yet. Be the first to say something!</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isOwn={user?.id === message.user_id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          {!user && !anonymousMode ? (
            <div className="text-center p-2">
              <p className="text-muted-foreground mb-2">Please sign in to participate in the chat</p>
              <Button variant="secondary" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none min-h-[80px]"
                disabled={sending || !user}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={sending || !newMessage.trim() || !user}
                size="icon"
                className="h-[80px]"
              >
                <Send />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatPage;
