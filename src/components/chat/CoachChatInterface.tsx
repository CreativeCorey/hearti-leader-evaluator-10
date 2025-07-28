import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string;
  recipient_id?: string;
  message_type: 'group' | 'individual';
  sender_role: string;
  created_at: string;
}

interface CoachChatInterfaceProps {
  recipientId?: string;
  recipientName?: string;
}

export const CoachChatInterface: React.FC<CoachChatInterfaceProps> = ({ 
  recipientId, 
  recipientName 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, [recipientId]);

  const loadMessages = async () => {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (recipientId) {
        // Load individual messages between coach and specific user
        query = query.or(`and(message_type.eq.individual,user_id.eq.${user?.id},recipient_id.eq.${recipientId}),and(message_type.eq.individual,user_id.eq.${recipientId},recipient_id.eq.${user?.id})`);
      } else {
        // Load group messages
        query = query.eq('message_type', 'group');
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      setMessages((data || []).map(msg => ({
        ...msg,
        message_type: msg.message_type as 'group' | 'individual'
      })));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Only add message if it's relevant to current conversation
          const isRelevant = recipientId 
            ? (newMessage.message_type === 'individual' && 
               ((newMessage.user_id === user?.id && newMessage.recipient_id === recipientId) ||
                (newMessage.user_id === recipientId && newMessage.recipient_id === user?.id)))
            : newMessage.message_type === 'group';

          if (isRelevant) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !user) return;

    setLoading(true);
    try {
      const messageData = {
        content: messageText.trim(),
        user_id: user.id,
        username: user.user_metadata?.name || user.email || 'Coach',
        message_type: recipientId ? 'individual' : 'group',
        recipient_id: recipientId || null,
        sender_role: 'admin'
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      setMessageText('');
      toast({
        title: 'Message sent',
        description: recipientId ? 
          `Message sent to ${recipientName}` : 
          'Message sent to group'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <CardTitle>
            {recipientId ? `Chat with ${recipientName}` : 'Group Chat'}
          </CardTitle>
        </div>
        <CardDescription>
          {recipientId ? 
            'Private conversation' : 
            'Group conversation with all users'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No messages yet
            </p>
          ) : (
            messages.map((message, index) => (
              <div key={message.id}>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.username}
                      </span>
                      <Badge variant={message.sender_role === 'admin' ? 'default' : 'secondary'}>
                        {message.sender_role === 'admin' ? 'Coach' : 'User'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
                {index < messages.length - 1 && <Separator className="mt-4" />}
              </div>
            ))
          )}
        </div>
        
        <div className="border-t p-4 space-y-4">
          <Textarea
            placeholder="Type your message here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={2}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!messageText.trim() || loading}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};