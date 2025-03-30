
import React from 'react';
import { Users, Hash, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default ChatSidebar;
