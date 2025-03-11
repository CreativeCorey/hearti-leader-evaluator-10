
import React from 'react';
import { HEARTIDimension } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { BaseRadarChart, DimensionIcons } from '../comparison/radar';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import { dimensionColors } from './DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { config, iconSize } = useRadarChartConfig();
  const isMobile = useIsMobile();
  
  // Create chart data for all dimensions or just the active one
  const allData = formatDataForRadarChart(dimensionScores);
  const singleDimensionData = allData.map(item => {
    if (item.name.toLowerCase() === activeDimension) {
      return item;
    }
    return { ...item, value: showAllDimensions ? item.value : 0 };
  });
  
  // Use pink color for user's radar chart when showing all dimensions (instead of gold)
  const userColor = showAllDimensions ? "#D946EF" : (dimensionColors[activeDimension] || "#6366f1");
  
  const chartTitle = showAllDimensions ? 
    "Your Complete HEARTI Spectra" : 
    `Focus on ${activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1)}`;

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <p className="text-center font-medium text-lg text-indigo-600 mb-2">{chartTitle}</p>
      <div className={`${isMobile && showAllDimensions ? 'h-[400px]' : 'h-[300px]'} relative`}>
        <DimensionIcons iconSize={iconSize} />
        
        <BaseRadarChart data={singleDimensionData} config={config}>
          <Radar
            name={showAllDimensions ? "Your HEARTI Spectra" : activeDimension}
            dataKey="value"
            stroke={userColor}
            fill={userColor}
            fillOpacity={config.fillOpacity}
            strokeWidth={config.strokeWidth}
            dot={{ r: config.dotSize }}
            activeDot={{ r: config.activeDotSize }}
            isAnimationActive={true}
            animationBegin={200}
            animationDuration={1000}
          />
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend wrapperStyle={isMobile && showAllDimensions ? { bottom: -30 } : undefined} />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default DimensionChart;
