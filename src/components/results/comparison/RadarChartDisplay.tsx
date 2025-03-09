
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';

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

  const ChartWithIcons = ({ data, chartColor, showIcons = true }) => (
    <div className="relative">
      {showIcons && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top (Humility) */}
          <div className="absolute top-[3%] left-[50%] transform -translate-x-1/2">
            <Gauge size={18} className="text-gray-400" />
          </div>
          
          {/* Top Right (Empathy) */}
          <div className="absolute top-[20%] right-[9%] transform">
            <HeartHandshake size={18} className="text-gray-400" />
          </div>
          
          {/* Bottom Right (Accountability) */}
          <div className="absolute bottom-[20%] right-[9%] transform">
            <ChartNoAxesCombined size={18} className="text-gray-400" />
          </div>
          
          {/* Bottom (Resiliency) */}
          <div className="absolute bottom-[3%] left-[50%] transform -translate-x-1/2">
            <TreePalm size={18} className="text-gray-400" />
          </div>
          
          {/* Bottom Left (Transparency) */}
          <div className="absolute bottom-[20%] left-[9%] transform">
            <Blend size={18} className="text-gray-400" />
          </div>
          
          {/* Top Left (Inclusivity) */}
          <div className="absolute top-[20%] left-[9%] transform">
            <Users size={18} className="text-gray-400" />
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid gridType={spiderConfig.gridType} />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ 
              fill: '#6b7280', 
              fontSize: isMobile ? 10 : 12 
            }} 
            axisLineType={spiderConfig.axisLineType}
            tickLine={false}
            tickMargin={10}
          />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
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

  if (chartView === 'combined') {
    return (
      <div className="bg-slate-50 p-6 rounded-lg h-[450px] w-full">
        <div className="relative h-full">
          {/* Icons in combined view - positioned more carefully */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top (Humility) */}
            <div className="absolute top-[3%] left-[50%] transform -translate-x-1/2">
              <Gauge size={18} className="text-gray-400" />
            </div>
            
            {/* Top Right (Empathy) */}
            <div className="absolute top-[20%] right-[9%] transform">
              <HeartHandshake size={18} className="text-gray-400" />
            </div>
            
            {/* Bottom Right (Accountability) */}
            <div className="absolute bottom-[20%] right-[9%] transform">
              <ChartNoAxesCombined size={18} className="text-gray-400" />
            </div>
            
            {/* Bottom (Resiliency) */}
            <div className="absolute bottom-[3%] left-[50%] transform -translate-x-1/2">
              <TreePalm size={18} className="text-gray-400" />
            </div>
            
            {/* Bottom Left (Transparency) */}
            <div className="absolute bottom-[20%] left-[9%] transform">
              <Blend size={18} className="text-gray-400" />
            </div>
            
            {/* Top Left (Inclusivity) */}
            <div className="absolute top-[20%] left-[9%] transform">
              <Users size={18} className="text-gray-400" />
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={combinedChartData}>
              <PolarGrid gridType={spiderConfig.gridType} />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ 
                  fill: '#6b7280', 
                  fontSize: isMobile ? 10 : 12 
                }} 
                axisLineType={spiderConfig.axisLineType}
                tickLine={false}
                tickMargin={10}
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
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
        <p className="text-center font-medium text-indigo-600 mb-2">Your HEARTI Spectra</p>
        <div className="relative h-full">
          <ChartWithIcons data={chartData} chartColor={userColor} />
        </div>
      </div>
      
      {compareMode !== 'none' && (
        <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
          <p className="text-center font-medium" style={{ color: getComparisonColor() }}>{getComparisonLabel()} Results</p>
          <div className="relative h-full">
            <ChartWithIcons 
              data={getComparisonData()} 
              chartColor={getComparisonColor()} 
              showIcons={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RadarChartDisplay;
