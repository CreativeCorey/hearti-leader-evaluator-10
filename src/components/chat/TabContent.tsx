import React, { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MessageList from './MessageList';
import OrganizationChat from './OrganizationChat';
import { Message } from '@/utils/supabase/messages';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface TabContentProps {
  messages: Message[];
  loading: boolean;
  userId?: string;
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ messages, loading, userId, activeTab }) => {
  const { user } = useAuth();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string>('');

  useEffect(() => {
    if (user && activeTab === 'organization') {
      fetchUserOrganization();
    }
  }, [user, activeTab]);

  const fetchUserOrganization = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, organizations(name)')
        .eq('id', user.id)
        .single();

      if (profile?.organization_id) {
        setOrganizationId(profile.organization_id);
        setOrganizationName(profile.organizations?.name || '');
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  };

  // Filter messages based on active tab
  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'broadcast':
        return messages.filter(msg => msg.message_type === 'broadcast');
      case 'group':
      default:
        return messages.filter(msg => msg.message_type === 'group' || !msg.message_type);
    }
  };

  return (
    <>
      <TabsContent value="group" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
        <MessageList 
          messages={getFilteredMessages().filter(msg => msg.message_type === 'group' || !msg.message_type)} 
          loading={loading} 
          userId={userId} 
        />
      </TabsContent>

      <TabsContent value="organization" className="flex-1 overflow-y-auto p-4 m-0">
        {!organizationId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Organization</h3>
              <p className="text-muted-foreground">
                You need to be part of an organization to access organization chat.
              </p>
            </div>
          </div>
        ) : (
          <OrganizationChat 
            organizationId={organizationId} 
            organizationName={organizationName}
          />
        )}
      </TabsContent>

      <TabsContent value="broadcast" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Admin Broadcasts</h3>
          <p className="text-sm text-muted-foreground">
            Messages from administrators to all users
          </p>
        </div>
        <MessageList 
          messages={getFilteredMessages().filter(msg => msg.message_type === 'broadcast')} 
          loading={loading} 
          userId={userId} 
        />
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