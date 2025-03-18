
import React from 'react';
import { Radar, Tooltip, Legend } from 'recharts';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';
import BaseRadarChart from './BaseRadarChart';
import DimensionIcons from './DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface CombinedChartProps {
  combinedChartData: any[];
  compareMode: 'none' | 'average';
  userColor: string;
  getComparisonColor: () => string;
  getComparisonLabel: () => string;
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
  const { t } = useLanguage();
  
  // Get properly translated text with fallbacks
  const yourHeartiText = t('results.comparison.yourHEARTI', { fallback: 'Your HEARTI' });
  const scoreText = t('results.comparison.score', { fallback: 'Score' });
  const selectOptionText = t('results.comparison.selectOption', { 
    fallback: 'Select a comparison option to view data' 
  });
  const useControlsText = t('results.comparison.useControls', { 
    fallback: 'Use the comparison controls above to visualize your HEARTI data' 
  });
  
  // Handle the case where no data should be shown (no comparison mode)
  if (compareMode === 'none') {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[280px] sm:h-[350px] w-full flex flex-col items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="mb-2">{selectOptionText}</p>
          <p className="text-sm">{useControlsText}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[280px] sm:h-[350px] w-full">
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
            tick: false,
            tickLine: false,
            stroke: '#d1d5db'
          }}
        >
          <defs>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {compareMode === 'average' && (
            <Radar
              name={`${getComparisonLabel()} ${scoreText}`}
              dataKey="Comparison"
              stroke={getComparisonColor()}
              fill={getComparisonColor()}
              fillOpacity={0.5}
              strokeWidth={config.strokeWidth}
              dot={{ r: config.dotSize, strokeWidth: 1, stroke: "white" }}
              activeDot={{ r: config.activeDotSize }}
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1000}
            />
          )}
          
          <Radar
            name={yourHeartiText}
            dataKey="Your Score"
            stroke={userColor}
            fill={userColor}
            fillOpacity={0.6}
            strokeWidth={config.strokeWidth}
            dot={{ r: config.dotSize, strokeWidth: 1, stroke: "white" }}
            activeDot={{ r: config.activeDotSize }}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1000}
            filter="url(#glow)"
          />
          
          <Tooltip 
            formatter={(value) => [`${value}/5`, scoreText]} 
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '6px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
          />
          <Legend 
            wrapperStyle={{ 
              bottom: isMobile ? 0 : 5, 
              fontSize: isMobile ? '10px' : '11px',
              width: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
            iconSize={12}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </BaseRadarChart>
      </div>
    </div>
  );
};

export default CombinedChart;
