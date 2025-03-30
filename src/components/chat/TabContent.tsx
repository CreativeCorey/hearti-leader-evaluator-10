
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MessageList from '@/components/chat/MessageList';

interface Message {
  id: string;
  content: string;
  username: string;
  user_id: string;
  created_at: string;
}

interface TabContentProps {
  messages: Message[];
  loading: boolean;
  userId?: string;
}

const TabContent: React.FC<TabContentProps> = ({ messages, loading, userId }) => {
  return (
    <>
      <TabsContent value="group" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
        <MessageList messages={messages} loading={loading} userId={userId} />
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
    </>
  );
};

export default TabContent;
