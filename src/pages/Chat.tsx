
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSidebar from '@/components/chat/ChatSidebar';
import MobileTabs from '@/components/chat/MobileTabs';
import TabContent from '@/components/chat/TabContent';
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the chat state interface to avoid directly calling the hook in render
interface ChatState {
  messages: any[];
  loading: boolean;
  participants: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chatState, setChatState] = useState<ChatState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize chat hook only after component is mounted
  useEffect(() => {
    let isMounted = true;
    
    try {
      // Initialize the chat properly using the hook inside the effect
      const { messages, loading, participants, activeTab, setActiveTab } = useChat();
      
      if (isMounted) {
        setChatState({
          messages,
          loading,
          participants,
          activeTab,
          setActiveTab
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error initializing chat:", err);
      if (isMounted) {
        setError("Failed to load chat. Please try again later.");
        setIsLoading(false);
        
        toast({
          title: "Chat Error",
          description: "There was an error loading the chat. Please try again.",
          variant: "destructive"
        });
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [toast]);
  
  // Handle navigation back to the main app
  const handleBackToAssessment = () => {
    navigate('/');
  };
  
  // If chat is still loading or encountered an error
  if (isLoading || error || !chatState) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="mb-4">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            onClick={handleBackToAssessment}
          >
            <ArrowLeft size={16} />
            Back to Assessment
          </Button>
        </div>
        <Card className="shadow-md p-8 text-center">
          {isLoading && <div className="animate-pulse">Loading chat...</div>}
          {error && <div className="text-red-500">{error}</div>}
        </Card>
      </div>
    );
  }
  
  // Destructure the chat state
  const { messages, loading, participants, activeTab, setActiveTab } = chatState;

  // Get chat title based on active tab
  const getChatTitle = () => {
    switch(activeTab) {
      case 'organization': return 'Organization Chat';
      case 'broadcast': return 'Admin Broadcasts';
      case 'spaces': return 'Spaces';
      case 'direct': return 'Direct Messages';
      case 'group':
      default: return 'Group Chat';
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-4 md:hidden">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleBackToAssessment}
        >
          <ArrowLeft size={16} />
          Back to Assessment
        </Button>
      </div>
      <div className="flex gap-4 h-[75vh]">
        {/* Sidebar navigation */}
        <ChatSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onBackToAssessment={handleBackToAssessment}
        />
        
        {/* Main chat area */}
        <Card className="shadow-md flex-1 flex flex-col">
          <ChatHeader 
            title={getChatTitle()} 
            type={activeTab as 'group' | 'space' | 'direct'} 
            participants={participants}
            onBack={handleBackToAssessment}
          />
          
          {/* Mobile tabs */}
          <MobileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Chat content area */}
          <Tabs value={activeTab} className="flex-1 flex flex-col overflow-hidden">
            <TabContent 
              messages={messages} 
              loading={loading} 
              userId={user?.id}
              activeTab={activeTab}
            />
          </Tabs>
          
          <div className="border-t p-4">
            <ChatInput activeTab={activeTab} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;
