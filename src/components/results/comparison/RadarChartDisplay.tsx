
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RadarChartDisplayProps {
  chartView: 'combined' | 'separate';
  chartData: any[];
  combinedChartData: any[];
  getComparisonData: () => any[] | null;
  compareMode: 'none' | 'average' | 'men' | 'women';
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  userColor: string;
  spiderConfig: {
    gridType: "polygon";
    axisLineType: "polygon";
    strokeWidth: number;
    fillOpacity: number;
    dotSize: number;
    activeDotSize: number;
  };
}

const RadarChartDisplay: React.FC<RadarChartDisplayProps> = ({
  chartView,
  chartData,
  combinedChartData,
  getComparisonData,
  compareMode,
  getComparisonLabel,
  getComparisonColor,
  userColor,
  spiderConfig
}) => {
  const isMobile = useIsMobile();

  if (chartView === 'combined') {
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
              name="Your HEARTI Spectra"
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
                name={getComparisonLabel()}
                dataKey="comparisonValue"
                stroke={getComparisonColor()}
                fill={getComparisonColor()}
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
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
        <p className="text-center font-medium text-indigo-600 mb-2">Your HEARTI Spectra</p>
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
              name="Your HEARTI Spectra"
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
      
      {compareMode !== 'none' && (
        <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
          <p className="text-center font-medium" style={{ color: getComparisonColor() }}>{getComparisonLabel()} Results</p>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getComparisonData()}>
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
                name={getComparisonLabel()}
                dataKey="value"
                stroke={getComparisonColor()}
                fill={getComparisonColor()}
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

export default RadarChartDisplay;
