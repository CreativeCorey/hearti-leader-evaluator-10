
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DimensionChartViewSelectorProps {
  chartView: 'focused' | 'all';
  onChartViewChange: (view: 'focused' | 'all') => void;
}

const DimensionChartViewSelector: React.FC<DimensionChartViewSelectorProps> = ({
  chartView,
  onChartViewChange
}) => {
  return (
    <Tabs 
      value={chartView} 
      onValueChange={(value) => onChartViewChange(value as 'focused' | 'all')}
      className="ml-auto"
    >
      <TabsList>
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
