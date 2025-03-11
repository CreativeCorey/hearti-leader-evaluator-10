
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RadarChartConfig } from '@/hooks/use-radar-chart-config';

interface BaseRadarChartProps {
  data: any[];
  children: React.ReactNode;
  config: RadarChartConfig;
  className?: string;
}

const BaseRadarChart: React.FC<BaseRadarChartProps> = ({ 
  data, 
  children,
  config,
  className = ""
}) => {
  const isMobile = useIsMobile();
  
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius={config.outerRadius} 
        data={data}
      >
        <PolarGrid 
          gridType={config.gridType} 
          stroke="#d1d5db" 
          strokeDasharray="3 3" 
          strokeOpacity={0.7} 
        />
        <PolarAngleAxis 
          dataKey="name" 
          tick={isMobile ? false : { 
            fill: '#6b7280', 
            fontSize: 12 
          }} 
          axisLineType={config.axisLineType}
          tickLine={false}
          stroke="#d1d5db"
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 5]} 
          tick={{ 
            fill: '#9ca3af',
            fontSize: isMobile ? 8 : 10,
            opacity: 0.8
          }} 
          stroke="#e5e7eb"
        />
        {children}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default BaseRadarChart;
