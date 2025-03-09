
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { dimensionIcons, dimensionLabels } from '../results/development/DimensionIcons';
import { Search } from 'lucide-react';

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
          className={`flex items-center gap-1 w-full ${activeDimension === 'all' ? 'bg-blue-100' : ''}`}
          onClick={() => onDimensionChange('all')}
        >
          <Search className="text-gray-600" size={isMobile ? 16 : 18} />
          All Habits
        </TabsTrigger>
      </TabsList>
      
      {/* Dimension tabs in a 3-column grid regardless of screen size */}
      <TabsList className="w-full grid grid-cols-3 gap-1">
        {Object.entries(dimensionIcons)
          .filter(([key]) => key !== 'all')
          .map(([dimension, Icon]) => (
            <TabsTrigger 
              key={dimension}
              value={dimension} 
              className={`flex items-center justify-center gap-1 py-2 ${activeDimension === dimension ? 'bg-blue-100' : ''}`}
              onClick={() => onDimensionChange(dimension as HEARTIDimension)}
            >
              <Icon size={isMobile ? 14 : 16} className="mr-1" />
              <span className={isMobile ? "text-xs" : "text-sm"}>{dimensionLabels[dimension as HEARTIDimension]}</span>
            </TabsTrigger>
          ))}
      </TabsList>
    </div>
  );
};

export default HabitTabs;
