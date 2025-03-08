
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { spiderConfig, getComparisonColor, getComparisonLabel } from './SpiderChartConfig';

interface CombinedSpiderChartProps {
  combinedChartData: any[];
  compareMode: 'none' | 'average' | 'men' | 'women';
}

const CombinedSpiderChart: React.FC<CombinedSpiderChartProps> = ({ 
  combinedChartData, 
  compareMode 
}) => {
  const isMobile = useIsMobile();
  const userColor = "#6366f1";

  return (
    <div className="bg-slate-50 p-6 rounded-lg h-[450px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={combinedChartData}>
          <PolarGrid gridType={spiderConfig.gridType} />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ 
              fill: '#6b7280', 
              fontSize: isMobile ? 10 : 12 
            }} 
            axisLineType={spiderConfig.axisLineType}
            tickLine={false}
          />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
          <Radar
            name="Your Score"
            dataKey="value"
            stroke={userColor}
            fill={userColor}
            fillOpacity={spiderConfig.fillOpacity}
            strokeWidth={spiderConfig.strokeWidth}
            dot={{ r: spiderConfig.dotSize }}
            activeDot={{ r: spiderConfig.activeDotSize }}
            isAnimationActive={true}
            animationBegin={100}
            animationDuration={1000}
          />
          {compareMode !== 'none' && (
            <Radar
              name={getComparisonLabel(compareMode)}
              dataKey="comparisonValue"
              stroke={getComparisonColor(compareMode)}
              fill={getComparisonColor(compareMode)}
              fillOpacity={spiderConfig.fillOpacity}
              strokeWidth={spiderConfig.strokeWidth}
              dot={{ r: spiderConfig.dotSize }}
              activeDot={{ r: spiderConfig.activeDotSize }}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1000}
            />
          )}
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedSpiderChart;
