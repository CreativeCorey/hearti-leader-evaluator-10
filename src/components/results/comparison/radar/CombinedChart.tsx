
import React from 'react';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import BaseRadarChart from './BaseRadarChart';
import DimensionIcons from './DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface CombinedChartProps {
  combinedChartData: any[];
  compareMode: 'none' | 'average';
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
  
  // Handle the case where no data should be shown (no comparison mode)
  if (compareMode === 'none') {
    return (
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg h-[280px] sm:h-[350px] w-full flex flex-col items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="mb-2">Select a comparison option to view data</p>
          <p className="text-sm">Use the comparison controls above to visualize your HEARTI data</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg h-[280px] sm:h-[350px] w-full">
      <div className="relative h-full">
        <DimensionIcons iconSize={iconSize} />
        
        <BaseRadarChart 
          data={combinedChartData} 
          config={{
            ...config,
            outerRadius: isMobile ? "58%" : "65%"
          }}
          hideDimensionLabels={true}
          polarAngleProps={{
            tick: false, // Always hide dimension labels
            tickLine: false,
            stroke: '#d1d5db'
          }}
        >
          {/* Render comparison data first so user data appears on top */}
          {compareMode === 'average' && (
            <Radar
              name={`${getComparisonLabel()} HEARTI`}
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
            name="Your HEARTI"
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
          <Legend 
            wrapperStyle={{ 
              bottom: isMobile ? -14 : -5, 
              fontSize: isMobile ? '9px' : '10px',
              width: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            layout="vertical"
            verticalAlign="bottom"
            align="center"
          />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default CombinedChart;
