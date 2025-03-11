
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RadarChartConfig } from '@/hooks/use-radar-chart-config';

interface BaseRadarChartProps {
  data: any[];
  children: React.ReactNode;
  config: RadarChartConfig;
  polarRadiusProps?: {
    angle: number;
    domain: number[];
    tick: {
      fill: string;
      fontSize: number;
      opacity: number;
    };
    stroke: string;
  };
  polarAngleProps?: {
    tick: {
      fill: string;
      fontSize: number;
      fontWeight: number;
      opacity: number;
    } | false;
    tickLine: boolean;
    stroke: string;
  };
  className?: string;
  hideDimensionLabels?: boolean;
}

const BaseRadarChart: React.FC<BaseRadarChartProps> = ({ 
  data, 
  children,
  config,
  polarRadiusProps,
  polarAngleProps,
  className = "",
  hideDimensionLabels = false
}) => {
  const isMobile = useIsMobile();
  
  // Default props if not provided
  const defaultPolarRadiusProps = {
    angle: 30,
    domain: [0, 5],
    tick: {
      fill: '#9ca3af',
      fontSize: 9,
      opacity: 0.8
    },
    stroke: '#e5e7eb'
  };

  const defaultPolarAngleProps = {
    tick: false, // Default to hiding dimension labels
    tickLine: false,
    stroke: '#d1d5db'
  };

  // Use provided props or defaults
  const radiusProps = polarRadiusProps || defaultPolarRadiusProps;
  const angleProps = polarAngleProps || defaultPolarAngleProps;
  
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius={config.outerRadius} 
        width={500}
        height={500}
        data={data}
        margin={{ top: 15, right: 15, bottom: 20, left: 15 }}
      >
        <PolarGrid 
          gridType={config.gridType} 
          stroke="#d1d5db" 
          strokeDasharray="3 3" 
          strokeOpacity={0.7} 
        />
        <PolarAngleAxis 
          dataKey="name" 
          tick={angleProps.tick}
          axisLineType={config.axisLineType}
          tickLine={angleProps.tickLine}
          stroke={angleProps.stroke}
          strokeWidth={0.5}
        />
        <PolarRadiusAxis 
          angle={radiusProps.angle}
          domain={radiusProps.domain}
          tick={radiusProps.tick}
          stroke={radiusProps.stroke}
          axisLine={false}
          tickLine={false}
        />
        {children}
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default BaseRadarChart;
