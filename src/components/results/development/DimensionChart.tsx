
import React from 'react';
import { HEARTIDimension } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { BaseRadarChart, DimensionIcons } from '../comparison/radar';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import { dimensionColors } from './DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

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
  const { t } = useLanguage();
  
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
  
  const translatedDimension = t(`results.dimensions.${activeDimension}`);
  
  const chartTitle = showAllDimensions ? 
    t('results.development.activities') : 
    `${translatedDimension}`;

  // Adjust the chart container height based on view type
  const chartContainerHeight = "h-[180px] sm:h-[200px]";

  return (
    <div className="rounded-lg h-full relative p-4 border">
      <p className="text-center font-medium text-lg mb-1">{chartTitle}</p>
      <p className="text-center text-sm text-muted-foreground mb-3">
        {t('results.dimensions.score')}: {dimensionScores[activeDimension]}/5
      </p>
    </div>
  );
};

export default DimensionChart;
