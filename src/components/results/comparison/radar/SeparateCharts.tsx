
import React from 'react';
import ChartWithIcons from './ChartWithIcons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface SeparateChartsProps {
  chartData: any[];
  getComparisonData: () => any[] | null;
  compareMode: string;
  userColor: string;
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  spiderConfig?: any;  // Kept for backward compatibility
}

const SeparateCharts: React.FC<SeparateChartsProps> = ({
  chartData,
  getComparisonData,
  compareMode,
  userColor,
  getComparisonLabel,
  getComparisonColor
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Convert comparison data to array if needed
  const comparisonData = compareMode !== 'none' ? getComparisonData() : null;
  
  // Debug logging to understand data flow
  console.log('SeparateCharts - compareMode:', compareMode);
  console.log('SeparateCharts - comparisonData:', comparisonData);
  console.log('SeparateCharts - chartData:', chartData);
  
  // If no comparison mode is selected, only show the user chart
  if (compareMode === 'none') {
    return (
      <div className="flex flex-col items-center justify-center w-full mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[260px] sm:h-[280px] w-full shadow-sm">
          <p className="text-center font-medium text-fuchsia-600 mb-3">{t('results.spectra.title')}</p>
          <div className="relative h-[calc(100%-35px)]">
            <ChartWithIcons 
              data={chartData} 
              chartColor={userColor}
              chartTitle={t('results.spectra.title')}
              showIcons={true}
            />
          </div>
        </div>
      </div>
    );
  }
  
  // For separate mode with comparison, stack the charts vertically with more spacing
  return (
    <div className="w-full space-y-8 mb-12">
      <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[260px] sm:h-[280px] shadow-sm w-full">
        <p className="text-center font-medium text-fuchsia-600 mb-3">{t('results.spectra.title')}</p>
        <div className="relative h-[calc(100%-35px)]">
          <ChartWithIcons 
            data={chartData} 
            chartColor={userColor}
            chartTitle={t('results.spectra.title')}
            showIcons={true}
          />
        </div>
      </div>
      
      {compareMode !== 'none' && comparisonData && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-lg h-[260px] sm:h-[280px] shadow-sm w-full mt-6 mb-6">
          <p className="text-center font-medium mb-3" style={{ color: getComparisonColor() }}>
            {`${t('results.spectra.title')} - ${getComparisonLabel()}`}
          </p>
          <div className="relative h-[calc(100%-35px)]">
            <ChartWithIcons 
              data={comparisonData} 
              chartColor={getComparisonColor()} 
              showIcons={true}
              chartTitle={`${t('results.spectra.title')} - ${getComparisonLabel()}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeparateCharts;
