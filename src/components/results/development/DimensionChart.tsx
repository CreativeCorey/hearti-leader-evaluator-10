
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
  const { config, iconSize, polarRadiusProps, polarAngleProps } = useRadarChartConfig();
  const isMobile = useIsMobile();
  
  // Create chart data for all dimensions or just the active one
  const allData = formatDataForRadarChart(dimensionScores);
  const singleDimensionData = allData.map(item => {
    if (item.name.toLowerCase() === activeDimension) {
      return item;
    }
    return { ...item, value: showAllDimensions ? item.value : 0 };
  });
  
  // Use the dimension's color for both focused and complete view
  const dimensionColor = dimensionColors[activeDimension] || "#6366f1";
  
  const chartTitle = showAllDimensions ? 
    "Your Complete HEARTI Spectra" : 
    `Focus on ${activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1)}`;

  return (
    <div className="bg-slate-50 p-2 rounded-lg h-full">
      <p className="text-center font-medium text-lg text-indigo-600 mb-1">{chartTitle}</p>
      <div className={`radar-chart-container ${isMobile && showAllDimensions ? 'mobile-development-view' : ''} h-[220px] sm:h-[240px]`}>
        <DimensionIcons iconSize={iconSize} />
        
        <BaseRadarChart 
          data={singleDimensionData} 
          config={{
            ...config,
            outerRadius: isMobile ? "58%" : "65%"
          }}
          polarRadiusProps={polarRadiusProps}
          polarAngleProps={{
            ...polarAngleProps,
            tick: {
              ...polarAngleProps.tick,
              fontSize: isMobile ? 8 : 10
            }
          }}
          hideDimensionLabels={isMobile}
        >
          <Radar
            name={showAllDimensions ? "Your HEARTI Spectra" : activeDimension}
            dataKey="value"
            stroke={dimensionColor}
            fill={dimensionColor}
            fillOpacity={config.fillOpacity}
            strokeWidth={config.strokeWidth}
            dot={{ r: config.dotSize }}
            activeDot={{ r: config.activeDotSize }}
            isAnimationActive={true}
            animationBegin={200}
            animationDuration={1000}
          />
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend wrapperStyle={isMobile ? { bottom: -20, fontSize: "10px" } : { bottom: -10 }} />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default DimensionChart;
