
import React, { useState } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import {
  ComparisonControls,
  ViewTypeToggle,
  RadarChartDisplay,
  ComparisonAnalysis,
  aggregateData,
  userColor,
  comparisonColors,
  spiderConfig
} from './comparison';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ assessment }) => {
  const [compareMode, setCompareMode] = useState<'none' | 'average' | 'men' | 'women'>('none');
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);

  const getComparisonData = () => {
    if (compareMode === 'none') {
      return null;
    }
    
    let comparisonScores;
    
    if (compareMode === 'average') {
      comparisonScores = aggregateData.averageScores;
    } else if (compareMode === 'men') {
      comparisonScores = aggregateData.demographics.gender.men;
    } else if (compareMode === 'women') {
      comparisonScores = aggregateData.demographics.gender.women;
    }
    
    if (comparisonScores) {
      return formatDataForRadarChart(comparisonScores);
    }
    
    return null;
  };
  
  const combinedChartData = chartData.map((item, index) => {
    const comparisonData = getComparisonData();
    if (comparisonData) {
      return {
        ...item,
        comparisonValue: comparisonData[index].value
      };
    }
    return item;
  });

  const getComparisonLabel = () => {
    switch (compareMode) {
      case 'average': return 'Average';
      case 'men': return 'Men';
      case 'women': return 'Women';
      default: return '';
    }
  };

  const getComparisonColor = () => {
    switch (compareMode) {
      case 'average': return comparisonColors.average;
      case 'men': return comparisonColors.men;
      case 'women': return comparisonColors.women;
      default: return "#000000";
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">HEARTI:Leader Data Visualization</h3>
          <p className="text-sm text-muted-foreground">See how your scores compare to others</p>
        </div>
        
        <ComparisonControls 
          compareMode={compareMode}
          setCompareMode={setCompareMode}
        />
      </div>
      
      <div className="flex-1">
        <ViewTypeToggle 
          chartView={chartView}
          setChartView={setChartView}
        />
      
        <RadarChartDisplay
          chartView={chartView}
          chartData={chartData}
          combinedChartData={combinedChartData}
          getComparisonData={getComparisonData}
          compareMode={compareMode}
          getComparisonLabel={getComparisonLabel}
          getComparisonColor={getComparisonColor}
          userColor={userColor}
          spiderConfig={spiderConfig}
        />
        
        {compareMode !== 'none' && (
          <ComparisonAnalysis
            sortedDimensions={sortedDimensions}
            assessment={assessment}
            compareMode={compareMode}
            getComparisonLabel={getComparisonLabel}
            getComparisonColor={getComparisonColor}
            aggregateData={aggregateData}
          />
        )}
      </div>
    </div>
  );
};

export default ComparisonTab;
