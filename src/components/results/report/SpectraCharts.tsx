
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import RadarSpectraChart from './RadarSpectraChart';
import DimensionIcons from '../comparison/radar/DimensionIcons';
import { useRadarChartConfig } from '@/hooks/use-radar-chart-config';

interface SpectraChartsProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
}

const aggregateData = {
  averageScores: {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  }
};

const SpectraCharts: React.FC<SpectraChartsProps> = ({ assessment, assessments = [] }) => {
  const isMobile = useIsMobile();
  const { iconSize } = useRadarChartConfig();
  
  // Ensure we have valid dimension scores before proceeding
  const hasValidDimensionScores = assessment && 
    assessment.dimensionScores && 
    Object.keys(assessment.dimensionScores).length > 0;
  
  // Use sample data if assessment data is missing
  const userScores = hasValidDimensionScores ? 
    assessment.dimensionScores : 
    aggregateData.averageScores;
  
  const chartData = formatDataForRadarChart(userScores);
  const benchmarkData = formatDataForRadarChart(aggregateData.averageScores);
  
  // Using pink color for user's radar chart
  const userPinkColor = "#D946EF";
  const comparisonColors = {
    average: "#8b5cf6",
  };

  return (
    <div className="my-6 pdf-section">
      <h3 className="text-xl font-medium mb-5 pdf-section-title text-gray-700">Your HEARTI:Leader Spectra</h3>
      
      <div className={`${isMobile ? 'flex flex-col space-y-8' : 'lg:grid lg:grid-cols-2'} gap-6 pdf-charts-grid`}>
        <div className={`bg-gray-50 p-4 rounded-lg shadow-sm pdf-chart-column relative`}>
          <RadarSpectraChart
            data={chartData}
            title="Your HEARTI Spectra"
            chartColor={userPinkColor}
            className="mb-2"
          />
          <div className="absolute inset-0 pointer-events-none" style={{ paddingTop: "40px" }}>
            <DimensionIcons iconSize={iconSize} />
          </div>
        </div>
        
        <div className={`bg-gray-50 p-4 rounded-lg shadow-sm pdf-chart-column relative ${isMobile ? 'mt-4' : ''}`}>
          <RadarSpectraChart
            data={benchmarkData}
            title="Global HEARTI:Leader Benchmark"
            chartColor={comparisonColors.average}
            className="mb-2"
          />
          <div className="absolute inset-0 pointer-events-none" style={{ paddingTop: "40px" }}>
            <DimensionIcons iconSize={iconSize} />
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-6 leading-relaxed">
        The HEARTI:Leader Quotient report provides you with information about your strengths and areas that you can develop further. 
        The charts show your HEARTI:Leader Spectra - a visualization of your HEARTI competencies based on your responses, and the global benchmark for visual comparison.
        This information is a reference point only. 
        No leader is strongest in every competency, but learning how your results compare to other 21st century leaders can be insightful.
      </p>
    </div>
  );
};

export default SpectraCharts;
