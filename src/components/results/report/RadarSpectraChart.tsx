
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartData } from '@/types';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import { useIsMobile } from '@/hooks/use-mobile';

interface RadarSpectraChartProps {
  data: ChartData;
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
  const { config, polarRadiusProps, polarAngleProps } = useRadarChartConfig();
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <h4 className="text-md font-medium text-center text-gray-700 mb-2">{title}</h4>
      <div className="pdf-chart-container radar-base h-[240px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius={isMobile ? "50%" : config.outerRadius}
            data={data}
            margin={{ top: 20, right: 15, bottom: 20, left: 15 }}
          >
            <PolarGrid 
              gridType={config.gridType}
              stroke="#d1d5db" 
              strokeDasharray="3 3"
              strokeOpacity={0.7}
            />
            <PolarAngleAxis 
              dataKey="name" 
              tick={false} // Always hide dimension labels
              axisLineType={config.axisLineType}
              tickLine={false}
              stroke="#d1d5db"
            />
            <PolarRadiusAxis 
              angle={polarRadiusProps.angle}
              domain={polarRadiusProps.domain}
              tick={polarRadiusProps.tick}
              stroke={polarRadiusProps.stroke}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={chartColor}
              fill={chartColor}
              fillOpacity={config.fillOpacity}
              dot={{ fill: chartColor, r: config.dotSize }}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarSpectraChart;
