
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { spiderConfig, getComparisonColor, getComparisonLabel } from './SpiderChartConfig';

interface SeparateSpiderChartsProps {
  chartData: any[];
  comparisonData: any[] | null;
  compareMode: 'none' | 'average' | 'men' | 'women';
}

const SeparateSpiderCharts: React.FC<SeparateSpiderChartsProps> = ({
  chartData,
  comparisonData,
  compareMode
}) => {
  const isMobile = useIsMobile();
  const userColor = "#6366f1";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
        <p className="text-center font-medium text-indigo-600 mb-2">Your Results</p>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid gridType={spiderConfig.gridType} />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ 
                fill: '#6b7280', 
                fontSize: isMobile ? 8 : 10 
              }} 
              axisLineType={spiderConfig.axisLineType}
              tickLine={false}
            />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: isMobile ? 8 : 10 }} />
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
            <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {compareMode !== 'none' && comparisonData && (
        <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
          <p className="text-center font-medium" style={{ color: getComparisonColor(compareMode) }}>{getComparisonLabel(compareMode)} Results</p>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={comparisonData}>
              <PolarGrid gridType={spiderConfig.gridType} />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ 
                  fill: '#6b7280', 
                  fontSize: isMobile ? 8 : 10 
                }} 
                axisLineType={spiderConfig.axisLineType}
                tickLine={false}
              />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: isMobile ? 8 : 10 }} />
              <Radar
                name={getComparisonLabel(compareMode)}
                dataKey="value"
                stroke={getComparisonColor(compareMode)}
                fill={getComparisonColor(compareMode)}
                fillOpacity={spiderConfig.fillOpacity}
                strokeWidth={spiderConfig.strokeWidth}
                dot={{ r: spiderConfig.dotSize }}
                activeDot={{ r: spiderConfig.activeDotSize }}
                isAnimationActive={true}
                animationBegin={100}
                animationDuration={1000}
              />
              <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SeparateSpiderCharts;
