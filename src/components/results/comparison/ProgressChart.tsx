
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { dimensionColors } from '../development/DimensionIcons';

interface ProgressChartProps {
  assessments: HEARTIAssessment[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ assessments }) => {
  const isMobile = useIsMobile();

  // Only proceed if we have assessments
  if (!assessments || assessments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <p className="text-muted-foreground">No assessment data available.</p>
      </div>
    );
  }

  // Get the most recent assessment for dimension colors
  const latestAssessment = [...assessments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

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
                {latestAssessment && Object.keys(latestAssessment.dimensionScores).map((dimension) => (
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
  );
};

export default ProgressChart;
