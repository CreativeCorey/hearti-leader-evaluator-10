
import React from 'react';
import { Users, MessageSquare, Layout, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBackToAssessment?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  onBackToAssessment
}) => {
  return (
    <div className="hidden md:flex flex-col space-y-2 w-16 border-r">
      {onBackToAssessment && (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onBackToAssessment}
          title="Back to Assessment"
        >
          <Home size={24} />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveTab('group')}
        className={cn(
          "rounded-full",
          activeTab === 'group' && "bg-blue-100 text-blue-600"
        )}
        title="Group Chat"
      >
        <Users size={24} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveTab('direct')}
        className={cn(
          "rounded-full",
          activeTab === 'direct' && "bg-blue-100 text-blue-600"
        )}
        title="Direct Messages"
      >
        <MessageSquare size={24} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setActiveTab('spaces')}
        className={cn(
          "rounded-full",
          activeTab === 'spaces' && "bg-blue-100 text-blue-600"
        )}
        title="Spaces"
      >
        <Layout size={24} />
      </Button>
    </div>
  );
};

export default ChatSidebar;
