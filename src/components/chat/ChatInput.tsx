
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { sendMessage } from '@/utils/supabase/messages';

interface ChatInputProps {
  activeTab: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ activeTab }) => {
  const { user, anonymousMode } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

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
      const { error } = await sendMessage(
        newMessage.trim(),
        user.user_metadata?.name || user.email || 'Anonymous User',
        user.id
      );
      
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

  if (!user && !anonymousMode) {
    return (
      <div className="text-center p-2">
        <p className="text-muted-foreground mb-2">Please sign in to participate in the chat</p>
        <Button variant="secondary" onClick={() => window.location.href = '/auth'}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <Textarea
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="resize-none min-h-[80px]"
        disabled={sending || !user || activeTab !== 'group'}
      />
      <Button 
        onClick={handleSendMessage} 
        disabled={sending || !newMessage.trim() || !user || activeTab !== 'group'}
        size="icon"
        className="h-[80px]"
      >
        <Send />
      </Button>
    </div>
  );
};

export default ChatInput;
