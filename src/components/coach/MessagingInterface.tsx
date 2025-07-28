import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, User } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
}

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

export const MessagingInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('group');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadMessages();
    subscribeToMessages();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name')
        .neq('role', 'admin');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

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
      .channel('coach-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
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
        message_type: selectedRecipient === 'group' ? 'group' : 'individual',
        recipient_id: selectedRecipient === 'group' ? null : selectedRecipient,
        sender_role: 'admin'
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      setMessageText('');
      toast({
        title: 'Message sent',
        description: selectedRecipient === 'group' ? 
          'Message sent to all users' : 
          'Message sent to selected user'
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

  const filteredMessages = selectedRecipient === 'group' 
    ? messages.filter(m => m.message_type === 'group')
    : messages.filter(m => 
        m.message_type === 'individual' && 
        (m.recipient_id === selectedRecipient || m.user_id === selectedRecipient)
      );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Coach Messaging
          </CardTitle>
          <CardDescription>
            Send messages to users individually or as a group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      All Users (Group Message)
                    </div>
                  </SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {user.name || user.email}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={sendMessage} 
            disabled={!messageText.trim() || loading}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>
            {selectedRecipient === 'group' 
              ? 'Group messages' 
              : `Messages with ${users.find(u => u.id === selectedRecipient)?.name || users.find(u => u.id === selectedRecipient)?.email || 'user'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No messages yet
              </p>
            ) : (
              filteredMessages.map((message, index) => (
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
                  {index < filteredMessages.length - 1 && <Separator className="mt-4" />}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};