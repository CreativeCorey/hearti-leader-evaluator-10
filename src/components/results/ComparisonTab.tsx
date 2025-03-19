
import React, { useState, useEffect } from 'react';
import { HEARTIAssessment } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadarChartDisplay from "./comparison/RadarChartDisplay";
import ComparisonAnalysis from "./comparison/ComparisonAnalysis";
import ProgressChart from "./comparison/ProgressChart";
import { aggregateData, userColor, comparisonColors } from "./comparison/aggregateData";
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
}

// Helper function to convert dimensions to comparison format
const convertToComparisonFormat = (
  userScores: Record<string, number>,
  comparisonScores: Record<string, number> | null
) => {
  return Object.keys(userScores).map(key => ({
    dimension: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    'Your Score': userScores[key],
    Comparison: comparisonScores ? comparisonScores[key] : 0
  }));
};

const ComparisonTab: React.FC<ComparisonTabProps> = ({ assessment: initialAssessment, assessments = [] }) => {
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  const [compareMode, setCompareMode] = useState<'none' | 'average'>('average');
  const [assessment, setAssessment] = useState<HEARTIAssessment>(initialAssessment);
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // Reset the selected assessment when the initial assessment changes
  useEffect(() => {
    setAssessment(initialAssessment);
  }, [initialAssessment]);

  // Handle selection of an assessment from the progress chart
  const handleSelectAssessment = (selectedAssessment: HEARTIAssessment) => {
    setAssessment(selectedAssessment);
  };

  // Format data for radar charts
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  
  // Get comparison data based on selection
  const getComparisonData = () => {
    if (compareMode === 'average') {
      return formatDataForRadarChart(aggregateData.averageScores);
    }
    return null;
  };
  
  // Format data for combined chart
  const combinedChartData = convertToComparisonFormat(
    assessment.dimensionScores,
    compareMode === 'average' ? aggregateData.averageScores : null
  );
  
  // Get comparison label based on selection with proper translation
  const getComparisonLabel = () => {
    if (compareMode === 'average') {
      return t('results.comparison.averageLabel', { fallback: 'Average' });
    }
    return '';
  };
  
  // Get color for comparison data
  const getComparisonColor = () => {
    if (compareMode === 'average') return comparisonColors.average;
    return "#000000";
  };
  
  // Get translated text for UI elements
  const spectaText = t('results.comparison.title', { fallback: 'HEARTI:Leader Spectra' });
  const compareText = t('results.comparison.subtitle', { fallback: 'Compare your results with global benchmarks' });
  const combinedText = t('results.comparison.combined', { fallback: 'Combined' });
  const separateText = t('results.comparison.separate', { fallback: 'Separate' });
  const noneText = t('results.comparison.noneLabel', { fallback: 'None' });
  const averageText = t('results.comparison.averageLabel', { fallback: 'Average' });
  
  return (
    <div className={`space-y-6 ${isMobile ? 'mb-12' : ''}`}>
      <Card>
        <CardContent className={`pt-6 ${isMobile ? 'px-2' : ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div>
              <h3 className="text-lg font-semibold mb-1">{spectaText}</h3>
              <p className="text-sm text-muted-foreground">{compareText}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Tabs defaultValue="combined" className="w-full sm:w-auto" onValueChange={(value) => setChartView(value as 'combined' | 'separate')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="combined">{combinedText}</TabsTrigger>
                  <TabsTrigger value="separate">{separateText}</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <RadioGroup defaultValue="average" className="flex flex-row sm:flex-row space-x-2 w-auto" onValueChange={(value) => setCompareMode(value as 'none' | 'average')}>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="text-xs sm:text-sm">{noneText}</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="average" id="average" />
                  <Label htmlFor="average" className="text-xs sm:text-sm">{averageText}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="mb-6">
            <RadarChartDisplay 
              chartView={chartView}
              chartData={chartData}
              combinedChartData={combinedChartData}
              getComparisonData={getComparisonData}
              compareMode={compareMode}
              getComparisonLabel={getComparisonLabel}
              getComparisonColor={getComparisonColor}
              userColor={userColor}
            />
          </div>
          
          {compareMode !== 'none' && (
            <ComparisonAnalysis 
              assessment={assessment}
              averageScores={compareMode === 'average' ? aggregateData.averageScores : undefined} 
              comparisonLabel={getComparisonLabel()}
              comparisonColor={getComparisonColor()}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Only show the progress chart at the bottom */}
      {assessments && assessments.length > 0 && (
        <div className="mt-8 mb-8">
          <ProgressChart assessments={assessments} onSelectAssessment={handleSelectAssessment} />
        </div>
      )}
    </div>
  );
};

export default ComparisonTab;
