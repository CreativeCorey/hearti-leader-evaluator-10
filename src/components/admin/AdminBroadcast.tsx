import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Send } from 'lucide-react';

const AdminBroadcast = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendBroadcast = async () => {
    if (!message.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        content: message.trim(),
        user_id: user.id,
        username: user.email || 'Admin',
        message_type: 'broadcast',
        sender_role: 'admin'
      });

      if (error) throw error;

      toast({
        title: 'Broadcast sent',
        description: 'Your message has been sent to all users.',
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({
        title: 'Error sending broadcast',
        description: error instanceof Error ? error.message : 'Failed to send broadcast',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBroadcast();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Admin Broadcast
        </CardTitle>
        <CardDescription>
          Send a message to all users in the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type your broadcast message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[100px]"
        />
        <Button 
          onClick={sendBroadcast}
          disabled={!message.trim() || sending}
          className="w-full"
        >
          {sending ? 'Sending...' : 'Send Broadcast'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminBroadcast;