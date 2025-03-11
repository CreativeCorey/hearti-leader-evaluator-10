
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShareResultsCard from './sharing/ShareResultsCard';
import DimensionChart from './development/DimensionChart';
import ShareButton from './sharing/ShareButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface OverviewTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[]; 
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  assessment, 
  assessments = [], 
  onSelectAssessment 
}) => {
  const isMobile = useIsMobile();
  
  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  // Get dimension colors
  const getDimensionColor = (dimension: string) => {
    const colors: Record<string, string> = {
      humility: "#8b5cf6",
      empathy: "#ec4899",
      accountability: "#ef4444",
      resiliency: "#f59e0b",
      transparency: "#10b981",
      inclusivity: "#3b82f6"
    };
    return colors[dimension] || "#000000";
  };

  return (
    <div className="space-y-6">
      {/* Moved ShareResultsCard to the top */}
      <ShareResultsCard assessment={assessment} />
      
      {/* HEARTI Spectra Chart - Moved above score card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl md:text-2xl">HEARTI Spectra</CardTitle>
              <CardDescription className="text-sm">Your leadership dimension scores</CardDescription>
            </div>
            <ShareButton 
              assessment={assessment} 
              variant="outline"
              size={isMobile ? "sm" : "default"}
            />
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-0 pb-8">
          <div className="h-[320px] w-full mx-auto max-w-[450px]">
            <DimensionChart 
              dimensionScores={assessment.dimensionScores}
              activeDimension="humility"
              showAllDimensions={true}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* HEARTI:Leader Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your HEARTI:Leader Quotient</CardTitle>
          <CardDescription>Assessment completed on {formatDate(assessment.date)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">Overall Score</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{assessment.overallScore}</span>
                <span className="text-muted-foreground ml-1">/5</span>
              </div>
              <p className="text-sm">Your HEARTI:Leader Quotient indicates your overall proficiency in the skills needed for 21st century leadership.</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">Top Strength</p>
              <div className="flex items-center gap-2">
                {Object.entries(assessment.dimensionScores)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 1)
                  .map(([dimension, score]) => (
                    <div key={dimension} className="space-y-1">
                      <p className="font-medium capitalize">{dimension}</p>
                      <Badge variant="default" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                    </div>
                  ))}
              </div>
              <p className="text-sm">This is your highest-scoring HEARTI dimension.</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">Development Area</p>
              <div className="flex items-center gap-2">
                {Object.entries(assessment.dimensionScores)
                  .sort(([, a], [, b]) => a - b)
                  .slice(0, 1)
                  .map(([dimension, score]) => (
                    <div key={dimension} className="space-y-1">
                      <p className="font-medium capitalize">{dimension}</p>
                      <Badge variant="outline" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                    </div>
                  ))}
              </div>
              <p className="text-sm">This dimension has the most potential for growth.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Assessment Progress Chart - Always display */}
      <Card>
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
  );
};

export default OverviewTab;
