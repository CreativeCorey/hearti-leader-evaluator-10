
import React, { useState } from 'react';
import { HEARTIDimension } from '@/types';
import DimensionChart from './DimensionChart';
import DimensionChartViewSelector from './DimensionChartViewSelector';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartSectionProps {
  activeDimension: HEARTIDimension;
  dimensionScores: Record<HEARTIDimension, number>;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  activeDimension,
  dimensionScores
}) => {
  const [chartView, setChartView] = useState<'focused' | 'all'>('focused');
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-6 space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between items-center'}`}>
        <h3 className={`text-xl font-semibold ${isMobile ? 'mb-2' : ''}`}>
          HEARTI Spectra
        </h3>
        <DimensionChartViewSelector 
          chartView={chartView}
          onChartViewChange={setChartView}
        />
      </div>
      
      <div className="h-[250px] sm:h-[280px] relative">
        <DimensionChart 
          dimensionScores={dimensionScores}
          activeDimension={activeDimension}
          showAllDimensions={chartView === 'all'}
        />
      </div>
    </div>
  );
};

export default ChartSection;
