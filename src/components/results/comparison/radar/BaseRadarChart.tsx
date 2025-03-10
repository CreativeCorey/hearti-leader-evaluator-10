
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RadarChartConfig } from '@/hooks/use-radar-chart-config';

interface BaseRadarChartProps {
  data: any[];
  children: React.ReactNode;
  config: RadarChartConfig;
}

const BaseRadarChart: React.FC<BaseRadarChartProps> = ({ 
  data, 
  children,
  config
}) => {
  const isMobile = useIsMobile();
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius={config.outerRadius} 
        data={data}
      >
        <PolarGrid gridType={config.gridType} />
        <PolarAngleAxis 
          dataKey="name" 
          tick={isMobile ? false : { 
            fill: '#6b7280', 
            fontSize: 12 
          }} 
          axisLineType={config.axisLineType}
          tickLine={false}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 5]} 
          tick={{ 
            fill: '#C8C8C9',
            fontSize: isMobile ? 8 : 10,
            opacity: 0.7
          }} 
        />
        {children}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default BaseRadarChart;
