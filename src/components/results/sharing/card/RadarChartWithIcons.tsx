
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';
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
  const { t } = useLanguage();
  
  // Format data for radial bar chart
  const chartData = Object.entries(assessment.dimensionScores).map(([dimension, score]) => ({
    name: t(`dimensions.${dimension}`),
    value: score * 20, // Convert 0-5 scale to 0-100 scale for better visualization
    fill: dimensionColors[dimension as keyof typeof dimensionColors]
  })).sort((a, b) => b.value - a.value); // Sort by value descending for better layering
  
  const iconSize = isMobile ? 20 : 18;
  
  return (
    <div className="h-[250px] w-full relative">
      {/* Position the dimension icons around the chart */}
      <div className="absolute inset-0 pointer-events-none z-10">
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
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="20%" 
          outerRadius="65%" 
          barSize={15} 
          data={chartData}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={6}
            label={{ 
              position: 'insideStart', 
              fill: '#fff', 
              fontSize: 10,
              fontWeight: 'bold',
              formatter: (value: any) => `${(value / 20).toFixed(1)}`
            }}
          />
          <Tooltip
            formatter={(value) => [`${(value as number / 20).toFixed(1)}/5`, 'Score']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '6px', 
              border: 'none', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
              padding: '8px 12px'
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      {/* Centered hexagon with initial */}
      <CenteredHexagon topStrength={topStrength} />
    </div>
  );
};

export default RadarChartWithIcons;
