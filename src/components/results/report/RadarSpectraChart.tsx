
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import { BaseRadarChart, DimensionIcons } from '../comparison/radar';
import { dimensionColors } from '../development/DimensionIcons';
import { HEARTIDimension } from '@/types';

interface RadarSpectraChartProps {
  data: any[];
  title: string;
  chartColor: string;
  className?: string;
}

// Use pink for user spectra by default
const USER_SPECTRA_COLOR = "#D946EF";

const RadarSpectraChart: React.FC<RadarSpectraChartProps> = ({ 
  data, 
  title, 
  chartColor = USER_SPECTRA_COLOR, // Default to pink for user data
  className = ""
}) => {
  const { config, iconSize } = useRadarChartConfig(false); // No animation for reports
  const isMobile = useIsMobile();
  
  // Determine if this is the user's chart to apply pink color
  const isUserChart = title.toLowerCase().includes("your") || title.toLowerCase().includes("you");
  const finalChartColor = isUserChart ? USER_SPECTRA_COLOR : chartColor;

  // Helper function to get the dimension from the chart data
  const getDimensionFromLabel = (label: string): HEARTIDimension | null => {
    const dimensionMap: Record<string, HEARTIDimension> = {
      "Humility": "humility",
      "Empathy": "empathy",
      "Accountability": "accountability",
      "Resiliency": "resiliency",
      "Transparency": "transparency",
      "Inclusivity": "inclusivity"
    };
    return dimensionMap[label] || null;
  };
  
  return (
    <div className={`relative ${className}`}>
      <p className="text-center font-medium text-lg text-indigo-600 mb-2">{title}</p>
      <div className="h-[280px] pdf-chart-container relative">
        <DimensionIcons iconSize={iconSize} />
        
        <BaseRadarChart data={data} config={config}>
          <Radar
            name={title}
            dataKey="value"
            stroke={finalChartColor}
            fill={finalChartColor}
            fillOpacity={config.fillOpacity}
            strokeWidth={config.strokeWidth}
            dot={{ r: isMobile ? 3 : config.dotSize }}
            activeDot={{ r: isMobile ? 5 : config.activeDotSize }}
            isAnimationActive={false}
          />
          <Tooltip 
            formatter={(value, name, props) => {
              const dimension = getDimensionFromLabel(props.payload.dimensionLabel);
              const color = dimension ? dimensionColors[dimension] : undefined;
              
              return [
                <span style={{ color: color || 'inherit' }}>
                  {`${value}/5`}
                </span>,
                'Score'
              ];
            }} 
          />
          <Legend 
            wrapperStyle={{ 
              position: 'absolute', 
              bottom: -15, 
              fontSize: isMobile ? '9px' : '10px',
              width: '100%',
              left: 0,
              textAlign: 'center'
            }} 
          />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default RadarSpectraChart;
