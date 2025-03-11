
import React from 'react';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import BaseRadarChart from './BaseRadarChart';
import DimensionIcons from './DimensionIcons';

interface ChartWithIconsProps {
  data: any[];
  chartColor: string;
  showIcons?: boolean;
  spiderConfig?: any;  // Kept for backward compatibility
  isAnimationActive?: boolean;
  className?: string;
}

const ChartWithIcons: React.FC<ChartWithIconsProps> = ({ 
  data, 
  chartColor, 
  showIcons = true,
  isAnimationActive = true,
  className = ""
}) => {
  const { config, iconSize } = useRadarChartConfig(isAnimationActive);
  
  return (
    <div className={`relative h-full w-full flex items-center justify-center ${className}`}>
      {showIcons && <DimensionIcons iconSize={iconSize} />}
      
      <BaseRadarChart data={data} config={config}>
        <Radar
          name="Your HEARTI Spectra"
          dataKey="value"
          stroke={chartColor}
          fill={chartColor}
          fillOpacity={config.fillOpacity}
          strokeWidth={config.strokeWidth}
          dot={{ r: config.dotSize }}
          activeDot={{ r: config.activeDotSize }}
          isAnimationActive={isAnimationActive}
          animationBegin={isAnimationActive ? 100 : 0}
          animationDuration={isAnimationActive ? 1000 : 0}
        />
        <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
        <Legend />
      </BaseRadarChart>
    </div>
  );
};

export default ChartWithIcons;
