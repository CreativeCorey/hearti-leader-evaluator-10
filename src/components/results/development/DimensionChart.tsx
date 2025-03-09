
import React from 'react';
import { HEARTIDimension } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { dimensionIcons } from './DimensionIcons';

interface DimensionChartProps {
  dimensionScores: Record<HEARTIDimension, number>;
  activeDimension: HEARTIDimension;
  showAllDimensions?: boolean;
}

const DimensionChart: React.FC<DimensionChartProps> = ({ 
  dimensionScores, 
  activeDimension,
  showAllDimensions = false 
}) => {
  const isMobile = useIsMobile();
  
  // Create chart data for all dimensions or just the active one
  const allData = formatDataForRadarChart(dimensionScores);
  const singleDimensionData = allData.map(item => {
    if (item.name.toLowerCase() === activeDimension) {
      return item;
    }
    return { ...item, value: showAllDimensions ? item.value : 0 };
  });
  
  const DimensionIcon = dimensionIcons[activeDimension] || Gauge;
  const userColor = "#6366f1";
  
  // Configuration for the spider chart appearance
  const spiderConfig = {
    gridType: "polygon" as "polygon",
    axisLineType: "polygon" as "polygon",
    strokeWidth: 2,
    fillOpacity: 0.6,
    dotSize: 5,
    activeDotSize: 8,
  };
  
  const iconSize = isMobile ? 20 : 18;
  const iconColor = "text-gray-500";

  const chartTitle = showAllDimensions ? 
    "Your Complete HEARTI Spectra" : 
    `Focus on ${activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1)}`;

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <p className="text-center font-medium text-lg text-indigo-600 mb-2">{chartTitle}</p>
      <div className="h-[300px] relative">
        {/* Icon overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top (Humility) */}
          <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2">
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
          
          {/* Bottom (Resiliency) */}
          <div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2">
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
        
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={singleDimensionData}>
            <PolarGrid gridType={spiderConfig.gridType} />
            <PolarAngleAxis 
              dataKey="name" 
              tick={false}
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
              name={showAllDimensions ? "Your HEARTI Spectra" : activeDimension}
              dataKey="value"
              stroke={userColor}
              fill={userColor}
              fillOpacity={spiderConfig.fillOpacity}
              strokeWidth={spiderConfig.strokeWidth}
              dot={{ r: spiderConfig.dotSize }}
              activeDot={{ r: spiderConfig.activeDotSize }}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1000}
            />
            <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DimensionChart;
