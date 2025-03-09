
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
  
  const iconSize = isMobile ? 20 : 18;
  const iconColor = "text-gray-500";

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {showIcons && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top (Humility) - Adjusted position to move down slightly */}
          <div className="absolute top-[15%] left-[50%] transform -translate-x-1/2">
            <Gauge size={iconSize} className={iconColor} />
          </div>
          
          {/* Top Right (Empathy) */}
          <div className="absolute top-[25%] right-[15%] transform">
            <HeartHandshake size={iconSize} className={iconColor} />
          </div>
          
          {/* Bottom Right (Accountability) */}
          <div className="absolute bottom-[25%] right-[15%] transform">
            <ChartNoAxesCombined size={iconSize} className={iconColor} />
          </div>
          
          {/* Bottom (Resiliency) - Adjusted position to move up slightly */}
          <div className="absolute bottom-[15%] left-[50%] transform -translate-x-1/2">
            <TreePalm size={iconSize} className={iconColor} />
          </div>
          
          {/* Bottom Left (Transparency) */}
          <div className="absolute bottom-[25%] left-[15%] transform">
            <Blend size={iconSize} className={iconColor} />
          </div>
          
          {/* Top Left (Inclusivity) */}
          <div className="absolute top-[25%] left-[15%] transform">
            <Users size={iconSize} className={iconColor} />
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%" className="flex-1">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
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
