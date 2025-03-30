
import React from 'react';
import { Users, Hash, User } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MobileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileTabs: React.FC<MobileTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default MobileTabs;
