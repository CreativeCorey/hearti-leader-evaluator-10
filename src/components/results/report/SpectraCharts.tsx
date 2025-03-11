
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import RadarSpectraChart from './RadarSpectraChart';

interface SpectraChartsProps {
  assessment: HEARTIAssessment;
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

const SpectraCharts: React.FC<SpectraChartsProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const benchmarkData = formatDataForRadarChart(aggregateData.averageScores);
  
  const userColor = "#6366f1";
  const comparisonColors = {
    average: "#8b5cf6",
  };

  return (
    <div className="my-6 pdf-section">
      <h3 className="text-2xl font-medium mb-3 pdf-section-title">Your HEARTI:Leader Spectra</h3>
      <div className={`flex flex-col ${isMobile ? '' : 'lg:flex-row'} gap-4 pdf-charts-grid`}>
        <div className={`flex-1 bg-slate-50 p-4 rounded-lg pdf-chart-column ${isMobile ? 'mb-4' : ''}`}>
          <RadarSpectraChart
            data={chartData}
            title="Your HEARTI Spectra"
            chartColor={userColor}
          />
        </div>
        
        {!isMobile && (
          <div className="flex-1 bg-slate-50 p-4 rounded-lg pdf-chart-column">
            <RadarSpectraChart
              data={benchmarkData}
              title="Global HEARTI:Leader Benchmark"
              chartColor={comparisonColors.average}
            />
          </div>
        )}
      </div>
      
      {isMobile && (
        <div className="flex-1 bg-slate-50 p-4 rounded-lg pdf-chart-column mt-3">
          <RadarSpectraChart
            data={benchmarkData}
            title="Global HEARTI:Leader Benchmark"
            chartColor={comparisonColors.average}
          />
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mt-3">
        The HEARTI:Leader Quotient report provides you with information about your strengths and areas that you can develop further. 
        {isMobile ? 'The visualizations above show your HEARTI competencies and the global benchmark for comparison.' : 
        'On the left side is your HEARTI:Leader Spectra - a visualization of your HEARTI competencies based on your responses. On the right is the global benchmark for visual comparison.'} 
        This information is a reference point only. 
        No leader is strongest in every competency, but learning how your results compare to other 21st century leaders can be insightful.
      </p>
    </div>
  );
};

export default SpectraCharts;
