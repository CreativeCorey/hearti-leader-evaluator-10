
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dimensionIcons, dimensionColors } from './DimensionIcons';

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
        {Object.entries(dimensionIcons).map(([dimension, Icon]) => (
          <TabsTrigger 
            key={dimension} 
            value={dimension} 
            className="text-xs flex flex-col items-center gap-1 py-2"
            style={{ 
              color: activeDimension === dimension ? dimensionColors[dimension as HEARTIDimension] : undefined,
              backgroundColor: activeDimension === dimension ? `${dimensionColors[dimension as HEARTIDimension]}10` : undefined
            }}
          >
            <Icon size={16} style={{ color: dimensionColors[dimension as HEARTIDimension] }} />
            <span>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default DimensionTabs;
