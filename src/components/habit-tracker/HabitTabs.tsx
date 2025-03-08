
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className="mobile-tabs-container">
      <TabsList className="mobile-tabs">
        <TabsTrigger 
          value="all" 
          className="mobile-tab"
          onClick={() => onDimensionChange('all')}
        >
          All
        </TabsTrigger>
        <TabsTrigger 
          value="humility" 
          className="mobile-tab"
          onClick={() => onDimensionChange('humility')}
        >
          {isMobile ? "H" : "Humility"}
        </TabsTrigger>
        <TabsTrigger 
          value="empathy" 
          className="mobile-tab"
          onClick={() => onDimensionChange('empathy')}
        >
          {isMobile ? "E" : "Empathy"}
        </TabsTrigger>
        <TabsTrigger 
          value="accountability" 
          className="mobile-tab"
          onClick={() => onDimensionChange('accountability')}
        >
          {isMobile ? "A" : "Account."}
        </TabsTrigger>
        <TabsTrigger 
          value="resiliency" 
          className="mobile-tab"
          onClick={() => onDimensionChange('resiliency')}
        >
          {isMobile ? "R" : "Resiliency"}
        </TabsTrigger>
        <TabsTrigger 
          value="transparency" 
          className="mobile-tab"
          onClick={() => onDimensionChange('transparency')}
        >
          {isMobile ? "T" : "Transp."}
        </TabsTrigger>
        <TabsTrigger 
          value="inclusivity" 
          className="mobile-tab"
          onClick={() => onDimensionChange('inclusivity')}
        >
          {isMobile ? "I" : "Inclusivity"}
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default HabitTabs;
