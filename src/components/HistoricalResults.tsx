
import React from 'react';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { HEARTIAssessment, HEARTIDimension } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HistoricalResultsProps {
  assessments: HEARTIAssessment[];
  onSelect?: (assessment: HEARTIAssessment) => void;
}

const HistoricalResults: React.FC<HistoricalResultsProps> = ({ assessments, onSelect }) => {
  // If no assessments or only one, show a message
  if (assessments.length <= 1) {
    return (
      <Card className="appear-animate">
        <CardHeader>
          <CardTitle>Historical Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete more assessments to track your progress over time.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort assessments by date
  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Prepare data for overall score chart
  const overallScoreData = sortedAssessments.map(assessment => ({
    date: format(new Date(assessment.date), 'MMM d, yy'),
    score: assessment.overallScore,
    id: assessment.id // Include assessment ID for selection
  }));

  // Prepare data for dimension scores chart
  const dimensionData = sortedAssessments.map(assessment => {
    const data: Record<string, any> = {
      date: format(new Date(assessment.date), 'MMM d, yy'),
      id: assessment.id // Include assessment ID for selection
    };
    
    Object.entries(assessment.dimensionScores).forEach(([dimension, score]) => {
      data[dimension] = score;
    });
    
    return data;
  });

  // Colors for dimension lines
  const dimensionColors: Record<HEARTIDimension, string> = {
    humility: '#6366F1',
    empathy: '#10B981',
    accountability: '#F59E0B', 
    resiliency: '#EC4899',
    transparency: '#06B6D4',
    inclusivity: '#8B5CF6'
  };

  // Handle clicking a data point to select an assessment
  const handleDataPointClick = (data: any) => {
    if (onSelect && data && data.id) {
      const selectedAssessment = assessments.find(a => a.id === data.id);
      if (selectedAssessment) {
        onSelect(selectedAssessment);
      }
    }
  };

  return (
    <Card className="appear-animate">
      <CardHeader>
        <CardTitle>Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall">
          <TabsList className="mb-4">
            <TabsTrigger value="overall">Overall Score</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall">
            <div className="h-[300px] w-full">
              <p className="text-xs text-muted-foreground mb-2">Click on any data point to view that assessment's detailed report</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={overallScoreData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  onClick={(data) => handleDataPointClick(data.activePayload?.[0]?.payload)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value) => [`${value}/5`, 'Score']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Overall Score" 
                    stroke="#000" 
                    activeDot={{ r: 8, onClick: (data) => handleDataPointClick(data.payload) }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="dimensions">
            <div className="h-[400px] w-full">
              <p className="text-xs text-muted-foreground mb-2">Click on any data point to view that assessment's detailed report</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={dimensionData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  onClick={(data) => handleDataPointClick(data.activePayload?.[0]?.payload)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value) => [`${value}/5`, 'Score']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  {Object.keys(dimensionColors).map(dimension => (
                    <Line 
                      key={dimension}
                      type="monotone" 
                      dataKey={dimension} 
                      name={dimension.charAt(0).toUpperCase() + dimension.slice(1)} 
                      stroke={dimensionColors[dimension as HEARTIDimension]} 
                      activeDot={{ 
                        r: 6, 
                        onClick: (data) => handleDataPointClick(data.payload) 
                      }} 
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HistoricalResults;
