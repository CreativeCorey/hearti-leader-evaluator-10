
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Gauge, HeartHandshake, Goal, TreePalm, Blend, Users } from 'lucide-react';
import { dimensionColors } from '@/components/results/development/DimensionIcons';
import CenteredHexagon from './CenteredHexagon';

interface RadarChartWithIconsProps {
  assessment: HEARTIAssessment;
  topStrength: string;
  chartColor: string;
}

const RadarChartWithIcons: React.FC<RadarChartWithIconsProps> = ({ 
  assessment, 
  topStrength, 
  chartColor 
}) => {
  const isMobile = useIsMobile();
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const iconSize = isMobile ? 20 : 18;
  
  return (
    <div className="h-[250px] w-full relative">
      {/* Position the dimension icons around the chart */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2">
          <Gauge size={iconSize} style={{ color: dimensionColors.humility }} />
        </div>
        
        <div className="absolute top-[25%] right-[15%] transform">
          <HeartHandshake size={iconSize} style={{ color: dimensionColors.empathy }} />
        </div>
        
        <div className="absolute bottom-[25%] right-[15%] transform">
          <Goal size={iconSize} style={{ color: dimensionColors.accountability }} />
        </div>
        
        <div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2">
          <TreePalm size={iconSize} style={{ color: dimensionColors.resiliency }} />
        </div>
        
        <div className="absolute bottom-[25%] left-[15%] transform">
          <Blend size={iconSize} style={{ color: dimensionColors.transparency }} />
        </div>
        
        <div className="absolute top-[25%] left-[15%] transform">
          <Users size={iconSize} style={{ color: dimensionColors.inclusivity }} />
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          outerRadius={isMobile ? "60%" : "70%"} 
          data={chartData}
          cx="50%"
          cy="50%"
        >
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={false} 
            axisLineType="polygon"
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={{ 
              fill: '#C8C8C9',
              fontSize: isMobile ? 7 : 9,
              opacity: 0.7
            }} 
          />
          <Radar
            name="Your HEARTI Spectra"
            dataKey="value"
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={0.6}
            dot={{ r: 5 }}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Centered hexagon with initial */}
      <CenteredHexagon topStrength={topStrength as any} />
    </div>
  );
};

export default RadarChartWithIcons;
