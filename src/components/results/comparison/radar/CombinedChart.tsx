
import React from 'react';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import BaseRadarChart from './BaseRadarChart';
import DimensionIcons from './DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface CombinedChartProps {
  combinedChartData: any[];
  compareMode: 'none' | 'average' | 'men' | 'women';
  userColor: string;
  getComparisonColor: () => string;
  getComparisonLabel: () => string;
  spiderConfig?: any;  // Kept for backward compatibility
}

const CombinedChart: React.FC<CombinedChartProps> = ({
  combinedChartData,
  compareMode,
  userColor,
  getComparisonColor,
  getComparisonLabel
}) => {
  const { config, iconSize } = useRadarChartConfig();
  const isMobile = useIsMobile();
  
  // Using pink color for user data instead of gold
  const userPinkColor = "#D946EF";
  
  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg h-[350px] sm:h-[400px] w-full">
      <div className="relative h-full">
        <DimensionIcons iconSize={iconSize} />
        
        <BaseRadarChart 
          data={combinedChartData} 
          config={{
            ...config,
            outerRadius: isMobile ? "60%" : "65%"
          }}
        >
          {/* Render comparison data first so user data appears on top */}
          {compareMode !== 'none' && (
            <Radar
              name={`HEARTI Spectra - ${getComparisonLabel()}`}
              dataKey="Comparison"
              stroke={getComparisonColor()}
              fill={getComparisonColor()}
              fillOpacity={config.fillOpacity}
              strokeWidth={config.strokeWidth}
              dot={{ r: config.dotSize }}
              activeDot={{ r: config.activeDotSize }}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1000}
            />
          )}
          
          {/* Render user data with pink color and ensure it's on top by being last */}
          <Radar
            name="Your HEARTI Spectra"
            dataKey="Your Score"
            stroke={userPinkColor}
            fill={userPinkColor}
            fillOpacity={config.fillOpacity}
            strokeWidth={config.strokeWidth}
            dot={{ r: config.dotSize }}
            activeDot={{ r: config.activeDotSize }}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1000}
          />
          
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend wrapperStyle={isMobile ? { bottom: -15 } : undefined} />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default CombinedChart;
