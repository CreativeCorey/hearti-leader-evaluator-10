
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface DimensionChartViewSelectorProps {
  chartView: 'focused' | 'all';
  onChartViewChange: (view: 'focused' | 'all') => void;
}

const DimensionChartViewSelector: React.FC<DimensionChartViewSelectorProps> = ({
  chartView,
  onChartViewChange
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs 
      value={chartView} 
      onValueChange={(value) => onChartViewChange(value as 'focused' | 'all')}
      className={`${isMobile ? 'w-full mb-2' : 'ml-auto'}`}
    >
      <TabsList className={`${isMobile ? 'w-full' : ''}`}>
        <TabsTrigger value="focused" className="text-xs">
          Focus View
        </TabsTrigger>
        <TabsTrigger value="all" className="text-xs">
          Complete View
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DimensionChartViewSelector;
