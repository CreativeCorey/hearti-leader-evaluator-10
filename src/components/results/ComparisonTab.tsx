
import React, { useState } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import RadarChartDisplay from './comparison/RadarChartDisplay';
import ComparisonControls from './comparison/ComparisonControls';
import ComparisonAnalysis from './comparison/ComparisonAnalysis';
import ViewTypeToggle from './comparison/ViewTypeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { aggregateData } from './comparison/aggregateData';
import ProgressChart from './comparison/ProgressChart';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
  assessments: HEARTIAssessment[];
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ assessment, assessments }) => {
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  const [compareMode, setCompareMode] = useState<'none' | 'average'>('average');
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // Format the chart data
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  
  // Format data for the combined chart
  const combinedChartData = Object.keys(assessment.dimensionScores).map(key => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    "Your Score": assessment.dimensionScores[key],
    ...(compareMode !== 'none' && {
      "Comparison": aggregateData.averageScores[key]
    })
  }));

  // Determine chart colors and labels
  const userColor = "#D946EF"; // Pink for user data
  const getComparisonColor = () => "#8b5cf6"; // Purple for average
  const getComparisonLabel = () => t('results.comparison.average');

  // Create comparison data for the separate charts view
  const getComparisonData = () => {
    if (compareMode === 'average') {
      return formatDataForRadarChart(aggregateData.averageScores);
    }
    return null;
  };

  // Check if we have multiple assessments to show progress
  const hasMultipleAssessments = assessments && assessments.length > 1;

  // Convert string keys to HEARTIDimension for type safety
  const sortedDimensions = Object.keys(assessment.dimensionScores).map(key => key as HEARTIDimension);

  // Calculate additional spacing for the comparison analysis when in separate view
  const comparisonAnalysisSpacing = chartView === 'separate' ? 'mt-[520px] sm:mt-[500px] md:mt-16' : 'mt-6';

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t('results.comparison.title')}</CardTitle>
          <CardDescription>
            {t('results.comparison.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <ViewTypeToggle chartView={chartView} setChartView={setChartView} />
            <ComparisonControls compareMode={compareMode} setCompareMode={setCompareMode} />
          </div>
          
          <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
            <div className={`h-[300px] sm:h-[380px] w-full`}>
              <RadarChartDisplay 
                chartView={chartView}
                chartData={chartData}
                combinedChartData={combinedChartData}
                compareMode={compareMode}
                getComparisonLabel={getComparisonLabel}
                getComparisonColor={getComparisonColor}
                userColor={userColor}
                getComparisonData={getComparisonData}
              />
            </div>
          </div>
          
          {compareMode !== 'none' && (
            <div className={comparisonAnalysisSpacing}>
              <ComparisonAnalysis 
                assessment={assessment} 
                compareMode={compareMode}
                sortedDimensions={sortedDimensions}
                getComparisonLabel={getComparisonLabel}
                getComparisonColor={getComparisonColor}
                aggregateData={aggregateData}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Placed the ProgressChart outside of the Card as requested */}
      {hasMultipleAssessments && (
        <div className="mt-8 mb-4">
          <ProgressChart assessments={assessments} />
        </div>
      )}
    </div>
  );
};

export default ComparisonTab;
