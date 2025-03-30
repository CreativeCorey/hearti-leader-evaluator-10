
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
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize chat hook only after component is mounted
  const [chatHook, setChatHook] = useState<ReturnType<typeof useChat> | null>(null);
  
  useEffect(() => {
    // Prevent duplicate initialization
    if (isLoaded) return;
    
    try {
      // Initialize the chat hook
      const hook = useChat();
      setChatHook(hook);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast({
        title: "Chat Error",
        description: "There was an error loading the chat. Please try again.",
        variant: "destructive"
      });
    }
    
    return () => {
      // This cleanup happens when the component unmounts
      setIsLoaded(false);
    };
  }, [isLoaded, toast]);
  
  // Handle navigation back to the main app
  const handleBackToAssessment = () => {
    navigate('/');
  };
  
  // If chat isn't loaded yet, show a loading state
  if (!isLoaded || !chatHook) {
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
          <div className="animate-pulse">Loading chat...</div>
        </Card>
      </div>
    );
  }
  
  // Destructure the chat hook properties
  const { messages, loading, participants, activeTab, setActiveTab } = chatHook;

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
