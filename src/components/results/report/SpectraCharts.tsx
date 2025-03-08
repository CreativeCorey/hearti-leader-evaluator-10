
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';

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
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const userColor = "#6366f1";
  const comparisonColors = {
    average: "#8b5cf6",
  };

  return (
    <div className="my-8">
      <h3 className="text-lg font-medium mb-4">Your HEARTI:Leader Spectra</h3>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-slate-50 p-6 rounded-lg">
          <p className="text-center font-medium text-indigo-600 mb-2">Your Results</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                <Radar
                  name="Your Score"
                  dataKey="value"
                  stroke={userColor}
                  fill={userColor}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-50 p-6 rounded-lg">
          <p className="text-center font-medium text-purple-600 mb-2">Global Benchmark</p>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formatDataForRadarChart(aggregateData.averageScores)}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                <Radar
                  name="Global Average"
                  dataKey="value"
                  stroke={comparisonColors.average}
                  fill={comparisonColors.average}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        The HEARTI:Leader Quotient report provides you with information about your strengths and areas that you can develop further. 
        On the left side is your HEARTI:Leader Spectra - a visualization of your HEARTI competencies based on your responses. 
        On the right is the global benchmark for visual comparison. This information is a reference point only. 
        No leader is strongest in every competency, but learning how your results compare to other 21st century leaders can be insightful.
      </p>
    </div>
  );
};

export default SpectraCharts;
