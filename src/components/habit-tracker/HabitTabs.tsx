
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { dimensionIcons, dimensionLabels } from '../results/development/DimensionIcons';

interface HabitTabsProps {
  activeDimension: HEARTIDimension | 'all';
  onDimensionChange: (value: HEARTIDimension | 'all') => void;
}

const HabitTabs: React.FC<HabitTabsProps> = ({ 
  activeDimension, 
  onDimensionChange 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mobile-tabs-container space-y-2">
      {/* All tab in its own row, spanning full width */}
      <TabsList className="w-full flex justify-center">
        <TabsTrigger 
          value="all" 
          className="flex items-center gap-1 w-full"
          onClick={() => onDimensionChange('all')}
        >
          <span className="mr-1">🔍</span>
          All Habits
        </TabsTrigger>
      </TabsList>
      
      {/* Dimension tabs in a 2-column grid */}
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 gap-1">
        {Object.entries(dimensionIcons)
          .filter(([key]) => key !== 'all')
          .map(([dimension, Icon]) => (
            <TabsTrigger 
              key={dimension}
              value={dimension} 
              className="flex items-center justify-center gap-1"
              onClick={() => onDimensionChange(dimension as HEARTIDimension)}
            >
              <Icon size={isMobile ? 14 : 16} className="mr-1" />
              {dimensionLabels[dimension as HEARTIDimension]}
            </TabsTrigger>
          ))}
      </TabsList>
    </div>
  );
};

export default HabitTabs;
