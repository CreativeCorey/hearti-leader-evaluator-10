
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSidebar from '@/components/chat/ChatSidebar';
import MobileTabs from '@/components/chat/MobileTabs';
import TabContent from '@/components/chat/TabContent';
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const { messages, loading, participants, activeTab, setActiveTab } = useChat();
  const navigate = useNavigate();
  const isInitializedRef = useRef(false);
  
  // Prevent multiple initializations
  useEffect(() => {
    if (isInitializedRef.current) {
      // This is a duplicate instance, navigate back
      navigate('/');
      return;
    }
    
    isInitializedRef.current = true;
    
    // Cleanup when component unmounts
    return () => {
      isInitializedRef.current = false;
    };
  }, [navigate]);
  
  // Get chat title based on active tab
  const getChatTitle = () => {
    switch(activeTab) {
      case 'spaces': return 'Spaces';
      case 'direct': return 'Direct Messages';
      case 'group':
      default: return 'Group Chat';
    }
  };

  const handleBackToAssessment = () => {
    navigate('/');
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
