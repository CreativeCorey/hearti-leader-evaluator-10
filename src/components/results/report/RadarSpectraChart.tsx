
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
      <p className="text-center font-semibold text-lg mb-3">
        {title}
      </p>
      <div className="h-full aspect-square max-w-[300px] mx-auto pdf-chart-container">
        <DimensionIcons iconSize={isMobile ? Math.max(iconSize - 2, 14) : iconSize} />
        
        <BaseRadarChart 
          data={data} 
          config={{
            ...config,
            polarGridStrokeOpacity: 0.6,
            polarAngleAxisTextSize: isMobile ? 11 : 12,
            fillOpacity: 0.7,
            dotSize: isMobile ? 3.5 : 4,
            activeDotSize: isMobile ? 5 : 6,
            strokeWidth: 2
          }}
        >
          <Radar
            name={title}
            dataKey="value"
            stroke={finalChartColor}
            fill={finalChartColor}
            fillOpacity={0.7}
            strokeWidth={2}
            dot={{ r: isMobile ? 3.5 : 4, strokeWidth: 1, fill: "white" }}
            activeDot={{ r: isMobile ? 5 : 6 }}
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
              textAlign: 'center',
              color: finalChartColor
            }} 
          />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default RadarSpectraChart;
