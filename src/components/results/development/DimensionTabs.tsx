
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Gauge, Ear, BarChart, TreePalm, Search, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DimensionTabsProps {
  activeDimension: HEARTIDimension;
  onDimensionChange: (dimension: HEARTIDimension) => void;
}

const DimensionTabs: React.FC<DimensionTabsProps> = ({ 
  activeDimension, 
  onDimensionChange 
}) => {
  return (
    <Tabs 
      value={activeDimension} 
      onValueChange={(value) => onDimensionChange(value as HEARTIDimension)}
      className="mb-6"
    >
      <div className="mb-2 text-sm font-medium">Choose a dimension:</div>
      <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
        <TabsTrigger value="humility" className="text-xs flex flex-col items-center gap-1 py-2">
          <Gauge size={16} />
          <span>Humility</span>
        </TabsTrigger>
        <TabsTrigger value="empathy" className="text-xs flex flex-col items-center gap-1 py-2">
          <Ear size={16} />
          <span>Empathy</span>
        </TabsTrigger>
        <TabsTrigger value="accountability" className="text-xs flex flex-col items-center gap-1 py-2">
          <BarChart size={16} />
          <span>Accountability</span>
        </TabsTrigger>
        <TabsTrigger value="resiliency" className="text-xs flex flex-col items-center gap-1 py-2">
          <TreePalm size={16} />
          <span>Resiliency</span>
        </TabsTrigger>
        <TabsTrigger value="transparency" className="text-xs flex flex-col items-center gap-1 py-2">
          <Search size={16} />
          <span>Transparency</span>
        </TabsTrigger>
        <TabsTrigger value="inclusivity" className="text-xs flex flex-col items-center gap-1 py-2">
          <Users size={16} />
          <span>Inclusivity</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DimensionTabs;
