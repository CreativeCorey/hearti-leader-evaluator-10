
import React, { useState } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { aggregateData } from '@/data/comparisonData';
import ComparisonControls from './comparison/ComparisonControls';
import CombinedSpiderChart from './comparison/CombinedSpiderChart';
import SeparateSpiderCharts from './comparison/SeparateSpiderCharts';
import ComparisonAnalysis from './comparison/ComparisonAnalysis';

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

  return (
    <div>
      <ComparisonControls 
        compareMode={compareMode}
        setCompareMode={setCompareMode}
        chartView={chartView}
        setChartView={setChartView}
      />
      
      {chartView === 'combined' ? (
        <CombinedSpiderChart 
          combinedChartData={combinedChartData} 
          compareMode={compareMode} 
        />
      ) : (
        <SeparateSpiderCharts 
          chartData={chartData}
          comparisonData={getComparisonData()}
          compareMode={compareMode}
        />
      )}
      
      <ComparisonAnalysis 
        assessment={assessment}
        compareMode={compareMode}
        sortedDimensions={sortedDimensions}
      />
    </div>
  );
};

export default ComparisonTab;
