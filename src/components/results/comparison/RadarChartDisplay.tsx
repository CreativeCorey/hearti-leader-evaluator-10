
import React from 'react';
import { CombinedChart, SeparateCharts } from './radar';

interface RadarChartDisplayProps {
  chartView: 'combined' | 'separate';
  chartData: any[];
  combinedChartData: any[];
  getComparisonData: () => any[] | null;
  compareMode: 'none' | 'average' | 'men' | 'women';
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  userColor: string;
  spiderConfig: {
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
  userColor,
  spiderConfig
}) => {
  if (chartView === 'combined') {
    return (
      <CombinedChart
        combinedChartData={combinedChartData}
        compareMode={compareMode}
        userColor={userColor}
        getComparisonColor={getComparisonColor}
        getComparisonLabel={getComparisonLabel}
        spiderConfig={spiderConfig}
      />
    );
  }
  
  return (
    <SeparateCharts
      chartData={chartData}
      getComparisonData={getComparisonData}
      compareMode={compareMode}
      userColor={userColor}
      getComparisonLabel={getComparisonLabel}
      getComparisonColor={getComparisonColor}
      spiderConfig={spiderConfig}
    />
  );
};

export default RadarChartDisplay;
