
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { dimensionColors } from './development/DimensionIcons';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
}

const ComparisonTab: React.FC<ComparisonTabProps> = ({ assessment, assessments = [] }) => {
  const [compareMode, setCompareMode] = useState<'none' | 'average' | 'men' | 'women'>('none');
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  const isMobile = useIsMobile();
  
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

  // Format data for progress chart
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const progressData = [...assessments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      date: formatShortDate(item.date),
      fullDate: new Date(item.date).toLocaleDateString(),
      score: item.overallScore,
      ...item.dimensionScores
    }));

  // Get dimension colors using the centralized dimensionColors
  const getDimensionColor = (dimension: string) => {
    return dimensionColors[dimension as HEARTIDimension] || "#000000";
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
        
        {/* HEARTI Progress over time chart */}
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle>HEARTI Progress Over Time</CardTitle>
            <CardDescription>Track your leadership development journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`${isMobile ? 'h-[300px]' : 'h-[250px]'} w-full`}>
              {progressData.length > 1 ? (
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
                        stroke={getDimensionColor(dimension)}
                        strokeWidth={1.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Complete more assessments to see your progress over time.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonTab;
