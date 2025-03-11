
import React from 'react';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import BaseRadarChart from './BaseRadarChart';
import DimensionIcons from './DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartWithIconsProps {
  data: any[];
  chartColor: string;
  chartTitle?: string;
  showIcons?: boolean;
  spiderConfig?: any;  // Kept for backward compatibility
  isAnimationActive?: boolean;
  className?: string;
}

// Using pink color for user charts
const USER_CHART_COLOR = "#D946EF";

const ChartWithIcons: React.FC<ChartWithIconsProps> = ({ 
  data, 
  chartColor, 
  chartTitle = "Your HEARTI Spectra",
  showIcons = true,
  isAnimationActive = true,
  className = ""
}) => {
  const { config, iconSize, polarRadiusProps, polarAngleProps } = useRadarChartConfig(isAnimationActive);
  const isMobile = useIsMobile();
  
  // Use pink color for user charts (title containing "Your")
  const isUserChart = chartTitle.toLowerCase().includes("your");
  const finalChartColor = isUserChart ? USER_CHART_COLOR : chartColor;
  
  // Simplify the title for legend to save space
  const legendTitle = isUserChart ? "Your HEARTI" : 
    chartTitle.includes("Global") ? "Global HEARTI" : 
    chartTitle.replace("HEARTI Spectra - ", "");
  
  return (
    <div className={`relative radar-chart-container flex items-center justify-center ${className}`}>
      {showIcons && <DimensionIcons iconSize={iconSize} />}
      
      <BaseRadarChart 
        data={data} 
        config={{
          ...config,
          outerRadius: isMobile ? "58%" : "65%"
        }}
        polarRadiusProps={polarRadiusProps}
        polarAngleProps={{
          ...polarAngleProps,
          tick: false // Always hide dimension labels on radar charts
        }}
        hideDimensionLabels={true}
      >
        <Radar
          name={legendTitle}
          dataKey="value"
          stroke={finalChartColor}
          fill={finalChartColor}
          fillOpacity={config.fillOpacity}
          strokeWidth={config.strokeWidth}
          dot={{ r: config.dotSize }}
          activeDot={{ r: config.activeDotSize }}
          isAnimationActive={isAnimationActive}
          animationBegin={isAnimationActive ? 100 : 0}
          animationDuration={isAnimationActive ? 1000 : 0}
        />
        <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
        <Legend 
          wrapperStyle={{ 
            position: 'absolute', 
            bottom: -5, 
            fontSize: '10px',
            width: '90% !important'
          }} 
        />
      </BaseRadarChart>
    </div>
  );
};

export default ChartWithIcons;
