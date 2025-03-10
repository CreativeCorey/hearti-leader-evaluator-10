
import React from 'react';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import BaseRadarChart from './BaseRadarChart';
import DimensionIcons from './DimensionIcons';

interface CombinedChartProps {
  combinedChartData: any[];
  compareMode: 'none' | 'average' | 'men' | 'women';
  userColor: string;
  getComparisonColor: () => string;
  getComparisonLabel: () => string;
  spiderConfig?: any;  // Kept for backward compatibility
}

const CombinedChart: React.FC<CombinedChartProps> = ({
  combinedChartData,
  compareMode,
  userColor,
  getComparisonColor,
  getComparisonLabel
}) => {
  const { config, iconSize } = useRadarChartConfig();
  
  return (
    <div className="bg-slate-50 p-6 rounded-lg h-[450px] w-full">
      <div className="relative h-full">
        <DimensionIcons iconSize={iconSize} />
        
        <BaseRadarChart data={combinedChartData} config={config}>
          <Radar
            name="Your HEARTI Spectra"
            dataKey="value"
            stroke={userColor}
            fill={userColor}
            fillOpacity={config.fillOpacity}
            strokeWidth={config.strokeWidth}
            dot={{ r: config.dotSize }}
            activeDot={{ r: config.activeDotSize }}
            isAnimationActive={true}
            animationBegin={100}
            animationDuration={1000}
          />
          
          {compareMode !== 'none' && (
            <Radar
              name={getComparisonLabel()}
              dataKey="comparisonValue"
              stroke={getComparisonColor()}
              fill={getComparisonColor()}
              fillOpacity={config.fillOpacity}
              strokeWidth={config.strokeWidth}
              dot={{ r: config.dotSize }}
              activeDot={{ r: config.activeDotSize }}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1000}
            />
          )}
          
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default CombinedChart;
