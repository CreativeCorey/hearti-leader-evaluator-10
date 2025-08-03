import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Send, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type SimpleMessage = {
  id: string;
  content: string;
  username: string;
  user_id: string;
  created_at: string;
  sender_role?: string;
};

interface OrganizationChatProps {
  organizationId: string;
  organizationName?: string;
}

const OrganizationChat: React.FC<OrganizationChatProps> = ({ 
  organizationId, 
  organizationName 
}) => {
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, [organizationId]);

  const loadMessages = async () => {
    try {
      // Completely bypass TypeScript inference by using any
      const supabaseClient: any = supabase;
      const result = await supabaseClient
        .from('messages')
        .select('*')
        .eq('message_type', 'organization')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (result.error) throw result.error;
      
      setMessages(result.data || []);
    } catch (error) {
      console.error('Error loading organization messages:', error);
      toast({
        title: 'Error loading messages',
        description: 'Failed to load organization messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('organization-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `message_type=eq.organization,organization_id=eq.${organizationId}`
        },
        (payload: any) => {
          const newMsg = payload.new;
          const typedMessage: SimpleMessage = {
            id: newMsg.id,
            content: newMsg.content,
            username: newMsg.username,
            user_id: newMsg.user_id,
            created_at: newMsg.created_at,
            sender_role: newMsg.sender_role
          };
          setMessages(prev => [...prev, typedMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        content: newMessage.trim(),
        user_id: user.id,
        username: user.email || 'User',
        message_type: 'organization',
        organization_id: organizationId,
        sender_role: 'user'
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-pulse">Loading organization chat...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {organizationName || 'Organization'} Chat
        </CardTitle>
        <CardDescription>
          Chat with other members of your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 h-full">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={message.id}>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {message.username}
                        {message.sender_role === 'admin' && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm bg-muted/50 rounded-lg p-3">
                      {message.content}
                    </p>
                  </div>
                  {index < messages.length - 1 && <Separator className="mt-4" />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            rows={2}
          />
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationChat;