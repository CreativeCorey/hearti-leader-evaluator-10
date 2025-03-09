
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';

interface ChartWithIconsProps {
  data: any[];
  chartColor: string;
  showIcons?: boolean;
  spiderConfig: {
    gridType: "polygon";
    axisLineType: "polygon";
    strokeWidth: number;
    fillOpacity: number;
    dotSize: number;
    activeDotSize: number;
  };
}

const ChartWithIcons: React.FC<ChartWithIconsProps> = ({ 
  data, 
  chartColor, 
  showIcons = true,
  spiderConfig
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative h-full">
      {showIcons && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top (Humility) */}
          <div className="absolute top-[3%] left-[50%] transform -translate-x-1/2">
            <Gauge size={isMobile ? 24 : 18} className="text-gray-600" />
          </div>
          
          {/* Top Right (Empathy) */}
          <div className="absolute top-[20%] right-[9%] transform">
            <HeartHandshake size={isMobile ? 24 : 18} className="text-gray-600" />
          </div>
          
          {/* Bottom Right (Accountability) */}
          <div className="absolute bottom-[20%] right-[9%] transform">
            <ChartNoAxesCombined size={isMobile ? 24 : 18} className="text-gray-600" />
          </div>
          
          {/* Bottom (Resiliency) */}
          <div className="absolute bottom-[3%] left-[50%] transform -translate-x-1/2">
            <TreePalm size={isMobile ? 24 : 18} className="text-gray-600" />
          </div>
          
          {/* Bottom Left (Transparency) */}
          <div className="absolute bottom-[20%] left-[9%] transform">
            <Blend size={isMobile ? 24 : 18} className="text-gray-600" />
          </div>
          
          {/* Top Left (Inclusivity) */}
          <div className="absolute top-[20%] left-[9%] transform">
            <Users size={isMobile ? 24 : 18} className="text-gray-600" />
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid gridType={spiderConfig.gridType} />
          <PolarAngleAxis 
            dataKey="name" 
            tick={isMobile ? false : { 
              fill: '#6b7280', 
              fontSize: 12 
            }} 
            axisLineType={spiderConfig.axisLineType}
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={{ 
              fill: isMobile ? '#C8C8C9' : '#6b7280',
              fontSize: isMobile ? 8 : 10 
            }} 
          />
          <Radar
            name="Your HEARTI Spectra"
            dataKey="value"
            stroke={chartColor}
            fill={chartColor}
            fillOpacity={spiderConfig.fillOpacity}
            strokeWidth={spiderConfig.strokeWidth}
            dot={{ r: spiderConfig.dotSize }}
            activeDot={{ r: spiderConfig.activeDotSize }}
            isAnimationActive={true}
            animationBegin={100}
            animationDuration={1000}
          />
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWithIcons;
