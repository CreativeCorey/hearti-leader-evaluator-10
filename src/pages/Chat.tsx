
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Users, User, Hash, Plus } from 'lucide-react';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatHeader from '@/components/chat/ChatHeader';
import { 
  fetchMessages, 
  sendMessage, 
  subscribeToMessages 
} from '@/utils/supabase/messages';

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
  const [activeTab, setActiveTab] = useState('group');
  const [participants, setParticipants] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        
        // Get messages from Supabase
        const { data, error } = await fetchMessages(50);
          
        if (error) {
          console.error('Error loading messages:', error);
          toast({
            title: 'Error loading messages',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        // Count unique participants
        if (data) {
          const uniqueUsers = new Set(data.map(msg => msg.user_id));
          setParticipants(uniqueUsers.size);
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
      // Scroll to bottom when new message arrives
      setTimeout(scrollToBottom, 100);
    });
      
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

  // Get chat title based on active tab
  const getChatTitle = () => {
    switch(activeTab) {
      case 'spaces': return 'Spaces';
      case 'direct': return 'Direct Messages';
      case 'group':
      default: return 'Group Chat';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex gap-4 h-[80vh]">
        {/* Sidebar navigation */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-900 shadow-md rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-4">Chats</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col w-full bg-transparent space-y-1 items-start p-0">
              <TabsTrigger 
                value="group"
                className="w-full justify-start px-3 py-2 font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Users size={16} className="mr-2" /> All Members
              </TabsTrigger>
              <TabsTrigger 
                value="spaces"
                className="w-full justify-start px-3 py-2 font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Hash size={16} className="mr-2" /> Spaces
              </TabsTrigger>
              <TabsTrigger 
                value="direct"
                className="w-full justify-start px-3 py-2 font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User size={16} className="mr-2" /> Direct Messages
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Create new chat button */}
          <Button variant="outline" className="w-full mt-4">
            <Plus size={16} className="mr-2" /> New Chat
          </Button>
        </div>
        
        {/* Main chat area */}
        <Card className="shadow-md flex-1 flex flex-col">
          <ChatHeader 
            title={getChatTitle()} 
            type={activeTab as 'group' | 'space' | 'direct'} 
            participants={participants}
          />
          
          {/* Mobile tabs */}
          <div className="md:hidden border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 h-auto">
                <TabsTrigger value="group" className="py-2">
                  <Users size={16} className="mr-2" /> Group
                </TabsTrigger>
                <TabsTrigger value="spaces" className="py-2">
                  <Hash size={16} className="mr-2" /> Spaces
                </TabsTrigger>
                <TabsTrigger value="direct" className="py-2">
                  <User size={16} className="mr-2" /> DMs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Chat content area - Fix: Wrap all TabsContent in a Tabs component */}
          <Tabs value={activeTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsContent value="group" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
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
            </TabsContent>
            
            <TabsContent value="spaces" className="flex-1 overflow-y-auto p-4 m-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Spaces Coming Soon</h3>
                <p className="text-muted-foreground">Topic-based discussion spaces will be available soon!</p>
              </div>
            </TabsContent>
            
            <TabsContent value="direct" className="flex-1 overflow-y-auto p-4 m-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Direct Messages Coming Soon</h3>
                <p className="text-muted-foreground">1-to-1 messaging will be available soon!</p>
              </div>
            </TabsContent>
          </Tabs>
          
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
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
