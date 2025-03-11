
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
        cy="45%" 
        outerRadius={config.outerRadius} 
        width={500}
        height={500}
        data={data}
        margin={{ top: 0, right: 0, bottom: 20, left: 0 }} 
      >
        <PolarGrid 
          gridType={config.gridType} 
          stroke="#d1d5db" 
          strokeDasharray="3 3" 
          strokeOpacity={0.7} 
        />
        <PolarAngleAxis 
          dataKey="name" 
          tick={isMobile ? { 
            fill: '#6b7280', 
            fontSize: 10 
          } : { 
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
