
import React from 'react';
import { HEARTIDimension, HEARTIAssessment } from '@/types';
import DimensionChart from './DimensionChart';
import DimensionChartViewSelector from './DimensionChartViewSelector';

interface ChartSectionProps {
  activeDimension: HEARTIDimension;
  dimensionScores: Record<HEARTIDimension, number>;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  activeDimension,
  dimensionScores
}) => {
  const [chartView, setChartView] = React.useState<'focused' | 'all'>('focused');
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">HEARTI Spectra</h3>
        <DimensionChartViewSelector 
          chartView={chartView}
          onChartViewChange={setChartView}
        />
      </div>
      
      <div className="w-full h-[300px] mx-auto max-w-[500px]">
        <DimensionChart 
          dimensionScores={dimensionScores}
          activeDimension={activeDimension}
          showAllDimensions={chartView === 'all'}
        />
      </div>
      
      <p className="text-sm text-muted-foreground mt-2">
        {chartView === 'focused' 
          ? `This chart highlights your score for ${activeDimension}. Switch to the Complete View to see all dimensions.` 
          : `This chart shows all your HEARTI dimensions, with ${activeDimension} in context of your overall profile.`}
      </p>
    </div>
  );
};

export default ChartSection;
