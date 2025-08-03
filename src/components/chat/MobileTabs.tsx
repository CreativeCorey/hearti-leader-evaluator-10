
import React from 'react';
import { Users, MessageSquare, Layout, Building, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileTabs: React.FC<MobileTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden flex border-b">
      <button
        onClick={() => setActiveTab('group')}
        className={cn(
          "flex items-center justify-center flex-1 py-3 border-b-2 border-transparent",
          activeTab === 'group' && "border-blue-500 text-blue-600"
        )}
      >
        <Users size={20} className="mr-2" />
        <span>Group</span>
      </button>
      
      <button
        onClick={() => setActiveTab('organization')}
        className={cn(
          "flex items-center justify-center flex-1 py-3 border-b-2 border-transparent",
          activeTab === 'organization' && "border-blue-500 text-blue-600"
        )}
      >
        <Building size={20} className="mr-2" />
        <span>Org</span>
      </button>
      
      <button
        onClick={() => setActiveTab('broadcast')}
        className={cn(
          "flex items-center justify-center flex-1 py-3 border-b-2 border-transparent",
          activeTab === 'broadcast' && "border-blue-500 text-blue-600"
        )}
      >
        <Megaphone size={20} className="mr-2" />
        <span>Broadcasts</span>
      </button>

      <button
        onClick={() => setActiveTab('direct')}
        className={cn(
          "flex items-center justify-center flex-1 py-3 border-b-2 border-transparent",
          activeTab === 'direct' && "border-blue-500 text-blue-600"
        )}
      >
        <MessageSquare size={20} className="mr-2" />
        <span>Direct</span>
      </button>
      
      <button
        onClick={() => setActiveTab('spaces')}
        className={cn(
          "flex items-center justify-center flex-1 py-3 border-b-2 border-transparent",
          activeTab === 'spaces' && "border-blue-500 text-blue-600"
        )}
      >
        <Layout size={20} className="mr-2" />
        <span>Spaces</span>
      </button>
    </div>
  );
};

export default MobileTabs;
