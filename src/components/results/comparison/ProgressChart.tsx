
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { dimensionColors } from '../development/DimensionIcons';
import { useToast } from '@/hooks/use-toast';

interface ProgressChartProps {
  assessments: HEARTIAssessment[];
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ assessments, onSelectAssessment }) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Only proceed if we have assessments
  if (!assessments || assessments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={isMobile ? 'text-lg' : ''}>HEARTI Progress Over Time</CardTitle>
          <CardDescription className={isMobile ? 'text-xs' : ''}>Track your leadership development journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No assessment data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort assessments by date (newest to oldest)
  const sortedAssessments = [...assessments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format data for progress chart
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const progressData = [...assessments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item, index) => ({
      date: formatShortDate(item.date),
      fullDate: new Date(item.date).toLocaleDateString(),
      score: item.overallScore,
      ...item.dimensionScores,
      originalAssessment: item, // Store the original assessment object
      index // Store the index
    }));

  // Get dimension colors using the centralized dimensionColors
  const getDimensionColor = (dimension: string) => {
    return dimensionColors[dimension as HEARTIDimension] || "#000000";
  };

  // Calculate chart height based on mobile view and data points
  const chartHeight = isMobile 
    ? progressData.length > 3 ? 320 : 300 
    : 400;

  // Handle click on a dot in the chart
  const handleDotClick = useCallback((data: any, index: number) => {
    // Extract the assessment data from the clicked dot
    const assessment = data.originalAssessment;
    
    if (assessment && onSelectAssessment) {
      setSelectedPointIndex(index);
      onSelectAssessment(assessment);
      
      toast({
        title: "Assessment selected",
        description: `Showing data from ${new Date(assessment.date).toLocaleDateString()}`,
        duration: 3000,
      });
    }
  }, [onSelectAssessment, toast]);

  return (
    <Card>
      <CardHeader className={`${isMobile ? 'pb-1 pt-3' : 'pb-2'} text-center`}>
        <CardTitle className={isMobile ? 'text-lg' : ''}>HEARTI Progress Over Time</CardTitle>
        <CardDescription className={isMobile ? 'text-xs' : ''}>
          Select a point on the chart to view that assessment's data
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-2' : ''}>
        <div className={`w-full`} style={{ height: chartHeight }}>
          {progressData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressData}
                margin={{ top: 20, right: 20, left: 5, bottom: 5 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    handleDotClick(e.activePayload[0].payload, e.activePayload[0].payload.index);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis 
                  domain={[0, 5]} 
                  ticks={[0, 1, 2, 3, 4, 5]} 
                  padding={{ top: 20 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}/5`]}
                  labelFormatter={(label) => {
                    const item = progressData.find(d => d.date === label);
                    return item?.fullDate || label;
                  }}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingTop: '10px',
                    fontSize: isMobile ? '10px' : '12px',
                    width: '100%', 
                    margin: '0 auto',
                    textAlign: 'center'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  name="Overall Score" 
                  stroke="#000" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                  dot={(props: any) => {
                    const { cx, cy, index } = props;
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={selectedPointIndex === index ? 6 : 4} 
                        fill={selectedPointIndex === index ? "#D946EF" : "#000"} 
                        stroke={selectedPointIndex === index ? "#fff" : "none"}
                        strokeWidth={2}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  }}
                />
                {sortedAssessments[0] && Object.keys(sortedAssessments[0].dimensionScores).map((dimension) => (
                  <Line
                    key={dimension}
                    type="monotone"
                    dataKey={dimension}
                    name={dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                    stroke={getDimensionColor(dimension)}
                    strokeWidth={1.5}
                    dot={(props: any) => {
                      const { cx, cy, index } = props;
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={selectedPointIndex === index ? 5 : 3} 
                          fill={getDimensionColor(dimension)}
                          stroke={selectedPointIndex === index ? "#fff" : "none"}
                          strokeWidth={1}
                          style={{ cursor: 'pointer' }}
                        />
                      );
                    }}
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
