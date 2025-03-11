
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import RadarSpectraChart from './RadarSpectraChart';
import { Card } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const SpectraCharts: React.FC<SpectraChartsProps> = ({ assessment, assessments = [] }) => {
  const isMobile = useIsMobile();
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const benchmarkData = formatDataForRadarChart(aggregateData.averageScores);
  
  const userGoldColor = "#FFD700";
  const comparisonColors = {
    average: "#8b5cf6",
  };

  // Format data for progress chart
  const progressData = [...assessments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      date: formatDate(item.date),
      fullDate: new Date(item.date).toLocaleDateString(),
      score: item.overallScore,
      ...item.dimensionScores
    }));

  // Get dimension colors
  const getDimensionColor = (dimension: HEARTIDimension) => {
    const colors: Record<HEARTIDimension, string> = {
      humility: "#8b5cf6",
      empathy: "#ec4899",
      accountability: "#ef4444",
      resiliency: "#f59e0b",
      transparency: "#10b981",
      inclusivity: "#3b82f6"
    };
    return colors[dimension];
  };

  return (
    <div className="my-6 pdf-section">
      <h3 className="text-2xl font-medium mb-3 pdf-section-title">Your HEARTI:Leader Spectra</h3>
      
      {/* Swapped chart order - user spectra first */}
      <div className={`flex flex-col ${isMobile ? '' : 'lg:flex-row'} gap-4 pdf-charts-grid`}>
        <div className={`flex-1 bg-slate-50 p-4 rounded-lg pdf-chart-column ${isMobile ? 'mb-4' : ''}`}>
          <RadarSpectraChart
            data={chartData}
            title="Your HEARTI Spectra"
            chartColor={userGoldColor}
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
      
      {/* Assessment Progress Chart */}
      {progressData.length > 1 && (
        <Card className="p-4 mt-6">
          <h3 className="text-lg font-medium mb-3 text-center">HEARTI Progress Over Time</h3>
          <div className={`${isMobile ? 'h-[300px]' : 'h-[250px]'} w-full`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value) => [`${value}/5`]}
                  labelFormatter={(label) => {
                    const item = progressData.find(d => d.date === label);
                    return item?.fullDate || label;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Overall Score" 
                  stroke="#000" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                />
                {Object.keys(assessment.dimensionScores).map((dimension) => (
                  <Line
                    key={dimension}
                    type="monotone"
                    dataKey={dimension}
                    name={dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                    stroke={getDimensionColor(dimension as HEARTIDimension)}
                    strokeWidth={1.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
      
      <p className="text-sm text-muted-foreground mt-3">
        The HEARTI:Leader Quotient report provides you with information about your strengths and areas that you can develop further. 
        {isMobile ? 'The visualizations above show your HEARTI competencies and the global benchmark for comparison.' : 
        'The charts show your HEARTI:Leader Spectra - a visualization of your HEARTI competencies based on your responses, and the global benchmark for visual comparison.'} 
        This information is a reference point only. 
        No leader is strongest in every competency, but learning how your results compare to other 21st century leaders can be insightful.
      </p>
    </div>
  );
};

export default SpectraCharts;
