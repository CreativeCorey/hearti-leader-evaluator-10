
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatSidebar from '@/components/chat/ChatSidebar';
import MobileTabs from '@/components/chat/MobileTabs';
import TabContent from '@/components/chat/TabContent';
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { useEffect } from 'react';

const ChatPage = () => {
  const { user } = useAuth();
  const { messages, loading, participants, activeTab, setActiveTab } = useChat();
  
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
        <Link to="/">
          <Button variant="outline" className="w-full">
            Back to Assessment
          </Button>
        </Link>
      </div>
      <div className="flex gap-4 h-[75vh]">
        {/* Sidebar navigation */}
        <ChatSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Main chat area */}
        <Card className="shadow-md flex-1 flex flex-col">
          <ChatHeader 
            title={getChatTitle()} 
            type={activeTab as 'group' | 'space' | 'direct'} 
            participants={participants}
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
