
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Gauge, Ear, ChartNoAxesCombined, TreePalm, Search, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface HabitTabsProps {
  activeDimension: HEARTIDimension | 'all';
  onDimensionChange: (value: HEARTIDimension | 'all') => void;
}

const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: Ear,
  accountability: ChartNoAxesCombined,
  resiliency: TreePalm,
  transparency: Search,
  inclusivity: Users,
  all: Search, // Default icon for "All" category
};

const HabitTabs: React.FC<HabitTabsProps> = ({ 
  activeDimension, 
  onDimensionChange 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mobile-tabs-container">
      <TabsList className="w-full flex flex-wrap">
        <TabsTrigger 
          value="all" 
          className="flex items-center gap-1"
          onClick={() => onDimensionChange('all')}
        >
          <span className="mr-1">🔍</span>
          All
        </TabsTrigger>
        {Object.entries(dimensionIcons)
          .filter(([key]) => key !== 'all')
          .map(([dimension, Icon]) => (
            <TabsTrigger 
              key={dimension}
              value={dimension} 
              className="flex items-center gap-1"
              onClick={() => onDimensionChange(dimension as HEARTIDimension)}
            >
              <Icon size={isMobile ? 14 : 16} className="mr-1" />
              {isMobile 
                ? dimension.charAt(0).toUpperCase() 
                : dimension.charAt(0).toUpperCase() + dimension.slice(1)}
            </TabsTrigger>
          ))}
      </TabsList>
    </div>
  );
};

export default HabitTabs;
