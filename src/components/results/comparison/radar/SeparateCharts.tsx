
import React from 'react';
import ChartWithIcons from './ChartWithIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface SeparateChartsProps {
  chartData: any[];
  getComparisonData: () => any[] | null;
  compareMode: 'none' | 'average';
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
  
  // If no comparison mode is selected, only show the user chart
  if (compareMode === 'none') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[260px] sm:h-[280px] w-full shadow-sm">
          <p className="text-center font-medium text-fuchsia-600 mb-3">Your HEARTI Spectra</p>
          <div className="relative h-[calc(100%-35px)]">
            <ChartWithIcons 
              data={chartData} 
              chartColor={userColor}
              chartTitle="Your HEARTI Spectra"
              showIcons={true}
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-8' : 'md:grid-cols-2 gap-6'}`}>
      <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[260px] sm:h-[280px] shadow-sm">
        <p className="text-center font-medium text-fuchsia-600 mb-3">Your HEARTI Spectra</p>
        <div className="relative h-[calc(100%-35px)]">
          <ChartWithIcons 
            data={chartData} 
            chartColor={userColor}
            chartTitle="Your HEARTI Spectra"
            showIcons={true}
          />
        </div>
      </div>
      
      {compareMode === 'average' && comparisonData && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[260px] sm:h-[280px] shadow-sm">
          <p className="text-center font-medium mb-3" style={{ color: getComparisonColor() }}>
            HEARTI Spectra - {getComparisonLabel()}
          </p>
          <div className="relative h-[calc(100%-35px)]">
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
