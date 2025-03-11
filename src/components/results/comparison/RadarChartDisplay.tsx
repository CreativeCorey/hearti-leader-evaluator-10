
import React from 'react';
import { CombinedChart, SeparateCharts } from './radar';
import { useIsMobile } from '@/hooks/use-mobile';

interface RadarChartDisplayProps {
  chartView: 'combined' | 'separate';
  chartData: any[];
  combinedChartData: any[];
  getComparisonData: () => any[] | null;
  compareMode: 'none' | 'average';
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  userColor: string;
  spiderConfig?: {
    gridType: "polygon";
    axisLineType: "polygon";
    strokeWidth: number;
    fillOpacity: number;
    dotSize: number;
    activeDotSize: number;
  };
}

const RadarChartDisplay: React.FC<RadarChartDisplayProps> = ({
  chartView,
  chartData,
  combinedChartData,
  getComparisonData,
  compareMode,
  getComparisonLabel,
  getComparisonColor,
  userColor
}) => {
  const isMobile = useIsMobile();
  
  // Enhanced container styles
  const containerClasses = `
    radar-chart-container 
    ${isMobile ? 'p-2' : 'p-4'} 
    bg-gradient-to-br from-white to-slate-50
    shadow-sm rounded-lg
    transition-all duration-300
    hover:shadow-md
  `;
  
  if (chartView === 'combined') {
    return (
      <div className={containerClasses}>
        <CombinedChart
          combinedChartData={combinedChartData}
          compareMode={compareMode}
          userColor={userColor}
          getComparisonColor={getComparisonColor}
          getComparisonLabel={getComparisonLabel}
        />
      </div>
    );
  }
  
  return (
    <div className={containerClasses}>
      <SeparateCharts
        chartData={chartData}
        getComparisonData={getComparisonData}
        compareMode={compareMode}
        userColor={userColor}
        getComparisonLabel={getComparisonLabel}
        getComparisonColor={getComparisonColor}
      />
    </div>
  );
};

export default RadarChartDisplay;
