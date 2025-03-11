
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
      <h4 className="text-md font-medium text-center text-gray-700 mb-4">{title}</h4>
      <div className="pdf-chart-container radar-base h-[280px] sm:h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius={isMobile ? "55%" : "60%"}
            data={data}
            margin={{ top: 20, right: 20, bottom: 25, left: 20 }}
          >
            <defs>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
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
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={chartColor}
              fill={chartColor}
              fillOpacity={0.6}
              dot={{ fill: chartColor, r: 4, stroke: "white", strokeWidth: 1 }}
              isAnimationActive={true}
              animationDuration={1200}
              filter="url(#glow)"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarSpectraChart;
