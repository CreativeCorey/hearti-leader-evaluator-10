
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { dimensionColors } from '../development/DimensionIcons';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ProgressChartProps {
  assessment: HEARTIAssessment;
  assessments: HEARTIAssessment[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ assessment, assessments }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
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

  // Get dimension colors from the centralized dimension colors
  const getDimensionColor = (dimension: string) => {
    return dimensionColors[dimension as HEARTIDimension] || "#000000";
  };
  
  // Get translations for chart labels
  const chartTitle = t('results.comparison.progress', { 
    fallback: "HEARTI Progress Over Time" 
  });
  
  const chartSubtitle = t('results.comparison.progressSubtitle', { 
    fallback: "Select a point on the chart to view that assessment's data" 
  });
  
  const noDataMessage = t('results.comparison.noProgressData', { 
    fallback: "Complete more assessments to see your progress over time." 
  });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartSubtitle}</CardDescription>
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
                  name={t('results.comparison.overallScore', { fallback: "Overall Score" })} 
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
              <p className="text-muted-foreground">{noDataMessage}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
