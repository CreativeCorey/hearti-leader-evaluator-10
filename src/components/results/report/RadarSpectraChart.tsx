
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import { BaseRadarChart, DimensionIcons } from '../comparison/radar';

interface RadarSpectraChartProps {
  data: any[];
  title: string;
  chartColor: string;
  className?: string;
}

const RadarSpectraChart: React.FC<RadarSpectraChartProps> = ({ 
  data, 
  title, 
  chartColor,
  className = ""
}) => {
  const { config, iconSize } = useRadarChartConfig(false); // No animation for reports
  
  return (
    <div className={`relative ${className}`}>
      <p className="text-center font-medium text-lg text-indigo-600 mb-1">{title}</p>
      <div className="h-[300px] pdf-chart-container relative">
        <DimensionIcons iconSize={iconSize} />
        
        <BaseRadarChart data={data} config={config}>
          <Radar
            name={title}
            dataKey="value"
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={config.fillOpacity}
            strokeWidth={config.strokeWidth}
            dot={{ r: config.dotSize }}
            activeDot={{ r: config.activeDotSize }}
            isAnimationActive={false}
          />
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend wrapperStyle={{ position: 'absolute', bottom: -15, fontSize: '10px' }} />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default RadarSpectraChart;
