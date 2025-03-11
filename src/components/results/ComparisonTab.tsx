
import React, { useState } from 'react';
import { HEARTIAssessment } from '@/types';
import { formatDataForRadarChart, formatDataForCombinedChart } from '@/utils/calculations';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import DimensionSorter, { getSortedDimensions } from './comparison/DimensionSorter';
import RadarChartDisplay from './comparison/RadarChartDisplay';
import ComparisonControls from './comparison/ComparisonControls';
import ComparisonAnalysis from './comparison/ComparisonAnalysis';
import { ViewTypeToggle } from './comparison/ViewTypeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { aggregateData } from './comparison/aggregateData';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
  assessments: HEARTIAssessment[];
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ assessment, assessments }) => {
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  const [compareMode, setCompareMode] = useState<'none' | 'average' | 'men' | 'women'>('average');
  const isMobile = useIsMobile();
  
  // Get sorted dimensions using the utility function
  const sortedDimensions = getSortedDimensions(assessment);
  
  // Format the chart data
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const combinedChartData = formatDataForCombinedChart(
    assessment.dimensionScores, 
    compareMode === 'none' ? null : getComparisonData()
  );
  
  // Determine chart colors and labels
  const userColor = "#fbbf24"; // Gold

  // Helper function to get the appropriate comparison data
  function getComparisonData() {
    switch (compareMode) {
      case 'average':
        return aggregateData.averageScores;
      case 'men':
        return aggregateData.menScores;
      case 'women':
        return aggregateData.womenScores;
      default:
        return null;
    }
  }
  
  // Helper function to get the appropriate comparison label
  function getComparisonLabel() {
    switch (compareMode) {
      case 'average':
        return 'Global Average';
      case 'men':
        return 'Men Average';
      case 'women':
        return 'Women Average';
      default:
        return '';
    }
  }
  
  // Helper function to get the appropriate comparison color
  function getComparisonColor() {
    switch (compareMode) {
      case 'average':
        return "#8b5cf6";  // Purple
      case 'men':
        return "#3b82f6";  // Blue
      case 'women':
        return "#ec4899";  // Pink
      default:
        return "#9ca3af";  // Gray
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>HEARTI Comparison</CardTitle>
        <CardDescription>
          Compare your results with global benchmarks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DimensionSorter assessment={assessment} />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <ViewTypeToggle chartView={chartView} setChartView={setChartView} />
          <ComparisonControls compareMode={compareMode} setCompareMode={setCompareMode} />
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className={`h-[${isMobile ? '380px' : '450px'}] w-full`}>
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
        
        <ComparisonAnalysis 
          assessment={assessment} 
          compareMode={compareMode}
          comparisonData={getComparisonData()} 
          sortedDimensions={sortedDimensions}
        />
      </CardContent>
    </Card>
  );
};

export default ComparisonTab;
