
import React from 'react';
import ChartWithIcons from './ChartWithIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface SeparateChartsProps {
  chartData: any[];
  getComparisonData: () => any[] | null;
  compareMode: 'none' | 'average' | 'men' | 'women';
  userColor: string;
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  spiderConfig?: any;  // Kept for backward compatibility
}

const SeparateCharts: React.FC<SeparateChartsProps> = ({
  chartData,
  getComparisonData,
  compareMode,
  userColor,
  getComparisonLabel,
  getComparisonColor
}) => {
  const isMobile = useIsMobile();
  
  // Convert comparison data to array if needed
  const comparisonData = compareMode !== 'none' ? getComparisonData() : null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50 p-3 rounded-lg h-[260px] sm:h-[300px]">
        <p className="text-center font-medium text-indigo-600 mb-1">Your HEARTI Spectra</p>
        <div className="relative h-[calc(100%-30px)]">
          <ChartWithIcons 
            data={chartData} 
            chartColor={userColor}
            chartTitle="Your HEARTI Spectra"
          />
        </div>
      </div>
      
      {compareMode !== 'none' && comparisonData && (
        <div className="bg-slate-50 p-3 rounded-lg h-[260px] sm:h-[300px]">
          <p className="text-center font-medium mb-1" style={{ color: getComparisonColor() }}>
            HEARTI Spectra - {getComparisonLabel()}
          </p>
          <div className="relative h-[calc(100%-30px)]">
            <ChartWithIcons 
              data={comparisonData} 
              chartColor={getComparisonColor()} 
              showIcons={true}
              chartTitle={`HEARTI Spectra - ${getComparisonLabel()}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeparateCharts;
