
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
  const { t } = useLanguage();
  
  // Get the dimension color for the active dimension
  const dimensionColor = dimensionColors[activeDimension] || "#6366f1";
  
  // Get the translated dimension name
  const translatedDimension = t(`results.dimensions.${activeDimension}`);
  
  // Determine chart title based on whether we're showing all dimensions
  const chartTitle = showAllDimensions ? 
    t('results.development.activities') : 
    `${translatedDimension}`;

  // Only show the spectra chart in overview, not in development tab
  const isOverviewTab = window.location.hash.includes('overview') || !window.location.hash;
  
  if (!isOverviewTab && !showAllDimensions) {
    return (
      <div className="rounded-lg h-full relative p-4 border">
        <p className="text-center font-medium text-lg mb-1">{chartTitle}</p>
        <p className="text-center text-sm text-muted-foreground mb-3">
          {t('results.dimensions.score')}: {dimensionScores[activeDimension]}/5
        </p>
      </div>
    );
  }

  // This is what will render in the overview tab
  // The rest of the radar chart rendering logic goes here
  return (
    <div className="rounded-lg h-full relative p-4 border">
      <p className="text-center font-medium text-lg mb-1">{chartTitle}</p>
      <p className="text-center text-sm text-muted-foreground mb-3">
        {t('results.dimensions.score')}: {dimensionScores[activeDimension]}/5
      </p>
      
      <div className="h-[180px] sm:h-[200px] relative">
        <DimensionIcons iconSize={24} />
        <BaseRadarChart 
          data={formatDataForRadarChart(dimensionScores)}
          config={{
            outerRadius: "60%",
            gridType: "polygon",
            axisLineType: "polygon",
            strokeWidth: 2,
            fillOpacity: 0.6,
            dotSize: 4,
            activeDotSize: 6
          }}
        >
          <Radar
            name={translatedDimension}
            dataKey="value"
            stroke={dimensionColor}
            fill={dimensionColor}
            fillOpacity={0.6}
            strokeWidth={2}
            dot={{ r: 4 }}
            isAnimationActive={true}
          />
          <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
          <Legend />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default DimensionChart;
