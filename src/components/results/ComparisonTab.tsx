
import React, { useState } from 'react';
import { HEARTIAssessment } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import RadarChartDisplay from './comparison/RadarChartDisplay';
import ComparisonControls from './comparison/ComparisonControls';
import ComparisonAnalysis from './comparison/ComparisonAnalysis';
import ViewTypeToggle from './comparison/ViewTypeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { aggregateData } from './comparison/aggregateData';
import ProgressChart from './comparison/ProgressChart';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
  assessments: HEARTIAssessment[];
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ assessment, assessments }) => {
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  const [compareMode, setCompareMode] = useState<'none' | 'average'>('average');
  const isMobile = useIsMobile();
  
  // Format the chart data
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  
  // Define a function to format data for the combined chart
  const formatDataForCombinedChart = (userScores: any, comparisonScores: any) => {
    // Create basic chart data with user scores
    const baseData = Object.keys(userScores).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      "Your Score": userScores[key],
    }));
    
    // If we have comparison data and comparison mode is enabled, add it
    if (comparisonScores && compareMode !== 'none') {
      return baseData.map(item => ({
        ...item,
        "Comparison": comparisonScores[item.subject.toLowerCase()]
      }));
    }
    
    return baseData;
  };
  
  // Use the function to create combined chart data
  const combinedChartData = formatDataForCombinedChart(
    assessment.dimensionScores, 
    compareMode === 'none' ? null : aggregateData.averageScores
  );
  
  // Determine chart colors and labels
  const userColor = "#D946EF"; // Pink for user data

  // Helper function to get the appropriate comparison data
  function getComparisonData(): any[] {
    if (compareMode === 'average') {
      return formatDataForRadarChart(aggregateData.averageScores);
    }
    return [];
  }
  
  // Helper function to get the appropriate comparison label
  function getComparisonLabel() {
    return compareMode === 'average' ? 'Global Average' : '';
  }
  
  // Helper function to get the appropriate comparison color
  function getComparisonColor() {
    return compareMode === 'average' ? "#8b5cf6" : "#9ca3af";  // Purple for average, Gray otherwise
  }

  // Check if we have multiple assessments to show progress
  const hasMultipleAssessments = assessments && assessments.length > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>HEARTI Comparison</CardTitle>
        <CardDescription>
          Compare your results with global benchmarks
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
              getComparisonData={getComparisonData}
              compareMode={compareMode}
              getComparisonLabel={getComparisonLabel}
              getComparisonColor={getComparisonColor}
              userColor={userColor}
            />
          </div>
        </div>
        
        {compareMode !== 'none' && (
          <ComparisonAnalysis 
            assessment={assessment} 
            compareMode={compareMode}
            sortedDimensions={[]}
            getComparisonLabel={getComparisonLabel}
            getComparisonColor={getComparisonColor}
            aggregateData={aggregateData}
          />
        )}
        
        {/* Progress Chart showing dimension scores over time */}
        {hasMultipleAssessments && (
          <ProgressChart assessments={assessments} />
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonTab;
