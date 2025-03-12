
import React, { useState, useEffect } from 'react';
import { HEARTIAssessment } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RadarChartDisplay from "./comparison/RadarChartDisplay";
import ComparisonAnalysis from "./comparison/ComparisonAnalysis";
import ProgressChart from "./comparison/ProgressChart";
import { aggregateData, userColor, comparisonColors } from "./comparison/aggregateData";
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDataForRadarChart, convertToComparisonFormat } from '@/utils/calculations';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
}

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
  
  // Get comparison label based on selection
  const getComparisonLabel = () => {
    if (compareMode === 'average') return t('results.comparison.averageLabel');
    return '';
  };
  
  // Get color for comparison data
  const getComparisonColor = () => {
    if (compareMode === 'average') return comparisonColors.average;
    return "#000000";
  };
  
  return (
    <div className={`space-y-6 ${isMobile ? 'mb-12' : ''}`}>
      <Card>
        <CardContent className={`pt-6 ${isMobile ? 'px-2' : ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div>
              <h3 className="text-lg font-semibold mb-1">HEARTI Comparison</h3>
              <p className="text-sm text-muted-foreground">Compare your results with global benchmarks</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Tabs defaultValue="combined" className="w-full sm:w-auto" onValueChange={(value) => setChartView(value as 'combined' | 'separate')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="combined">{t('results.visualization.combined')}</TabsTrigger>
                  <TabsTrigger value="separate">{t('results.visualization.separate')}</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <RadioGroup defaultValue="average" className="flex flex-row sm:flex-row space-x-2 w-auto" onValueChange={(value) => setCompareMode(value as 'none' | 'average')}>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="text-xs sm:text-sm">{t('results.comparison.noneLabel')}</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="average" id="average" />
                  <Label htmlFor="average" className="text-xs sm:text-sm">{t('results.comparison.averageLabel')}</Label>
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
              comparisonScores={
                compareMode === 'average' ? aggregateData.averageScores : undefined
              }
              comparisonLabel={getComparisonLabel()}
              comparisonColor={getComparisonColor()}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Only show progress chart if there are multiple assessments */}
      {assessments && assessments.length > 0 && (
        <div className="mt-8 mb-8">
          <ProgressChart assessments={assessments} onSelectAssessment={handleSelectAssessment} />
        </div>
      )}
    </div>
  );
};

export default ComparisonTab;
