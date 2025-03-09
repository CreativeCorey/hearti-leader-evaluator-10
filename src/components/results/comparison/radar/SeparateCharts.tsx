
import React from 'react';
import ChartWithIcons from './ChartWithIcons';

interface SeparateChartsProps {
  chartData: any[];
  getComparisonData: () => any[] | null;
  compareMode: 'none' | 'average' | 'men' | 'women';
  userColor: string;
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  spiderConfig: {
    gridType: "polygon";
    axisLineType: "polygon";
    strokeWidth: number;
    fillOpacity: number;
    dotSize: number;
    activeDotSize: number;
  };
}

const SeparateCharts: React.FC<SeparateChartsProps> = ({
  chartData,
  getComparisonData,
  compareMode,
  userColor,
  getComparisonLabel,
  getComparisonColor,
  spiderConfig
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
        <p className="text-center font-medium text-indigo-600 mb-2">Your HEARTI Spectra</p>
        <div className="relative h-full">
          <ChartWithIcons 
            data={chartData} 
            chartColor={userColor} 
            spiderConfig={spiderConfig}
          />
        </div>
      </div>
      
      {compareMode !== 'none' && (
        <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
          <p className="text-center font-medium" style={{ color: getComparisonColor() }}>{getComparisonLabel()} Results</p>
          <div className="relative h-full">
            <ChartWithIcons 
              data={getComparisonData()} 
              chartColor={getComparisonColor()} 
              showIcons={true}
              spiderConfig={spiderConfig}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeparateCharts;
