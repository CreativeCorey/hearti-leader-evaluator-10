
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
          outerRadius: isMobile ? "55%" : "62%"
        }}
        polarRadiusProps={polarRadiusProps}
        polarAngleProps={{
          ...polarAngleProps,
          tick: false // Always hide dimension labels on radar charts
        }}
        hideDimensionLabels={true}
      >
        <defs>
          <filter id="chartGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <Radar
          name={legendTitle}
          dataKey="value"
          stroke={finalChartColor}
          fill={finalChartColor}
          fillOpacity={0.6}
          strokeWidth={config.strokeWidth}
          dot={{ r: config.dotSize, fill: finalChartColor, stroke: "white", strokeWidth: 1 }}
          activeDot={{ r: config.activeDotSize }}
          isAnimationActive={isAnimationActive}
          animationBegin={isAnimationActive ? 100 : 0}
          animationDuration={isAnimationActive ? 1000 : 0}
          filter="url(#chartGlow)"
        />
        <Tooltip 
          formatter={(value) => [`${value}/5`, 'Score']} 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '6px', 
            border: 'none', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '12px',
            padding: '8px 12px'
          }}
        />
        <Legend 
          wrapperStyle={{ 
            position: 'absolute', 
            bottom: -6, 
            fontSize: '11px',
            width: 'auto',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '4px',
            padding: '2px 8px'
          }} 
          iconSize={10}
        />
      </BaseRadarChart>
    </div>
  );
};

export default ChartWithIcons;
