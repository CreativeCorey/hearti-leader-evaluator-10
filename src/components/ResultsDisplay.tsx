
import React from 'react';
import { format } from 'date-fns';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip,
  Legend 
} from 'recharts';
import { 
  HEARTIAssessment, 
  HEARTIDimension
} from '../types';
import { 
  formatDataForRadarChart, 
  getFeedback 
} from '../utils/calculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface ResultsDisplayProps {
  assessment: HEARTIAssessment;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ assessment }) => {
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const formattedDate = format(new Date(assessment.date), 'MMMM d, yyyy');
  
  // Sort dimensions by score (highest to lowest)
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const developmentArea = sortedDimensions[sortedDimensions.length - 1];

  // Function to get badge color based on score
  const getBadgeVariant = (score: number) => {
    if (score >= 4.5) return "default";
    if (score >= 3.5) return "secondary";
    if (score >= 2.5) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-8">
      <Card className="appear-animate shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Heart className="text-gray-800" size={24} />
            HEARTI Assessment Results
          </CardTitle>
          <CardDescription>
            Completed on {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="radar-chart-container h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} />
                    <Radar
                      name="Your Score"
                      dataKey="value"
                      stroke="#000"
                      fill="#000"
                      fillOpacity={0.2}
                    />
                    <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                <div className="flex items-center gap-2">
                  <Badge className="text-lg py-1 px-3 score-pill" variant={getBadgeVariant(assessment.overallScore)}>
                    {assessment.overallScore} / 5
                  </Badge>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Dimension Scores</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(assessment.dimensionScores).map(([dimension, score]) => (
                    <Badge 
                      key={dimension} 
                      variant={getBadgeVariant(score)}
                      className="score-pill flex justify-between py-1 px-3"
                    >
                      <span>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</span>
                      <span>{score}/5</span>
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Key Insights</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium">Top Strength: {topStrength.charAt(0).toUpperCase() + topStrength.slice(1)}</p>
                    <p className="text-muted-foreground">{getFeedback(assessment.dimensionScores[topStrength], topStrength)}</p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Development Area: {developmentArea.charAt(0).toUpperCase() + developmentArea.slice(1)}</p>
                    <p className="text-muted-foreground">{getFeedback(assessment.dimensionScores[developmentArea], developmentArea)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {assessment.demographics && Object.keys(assessment.demographics).length > 0 && (
            <>
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Demographic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assessment.demographics.managementLevel && (
                    <div>
                      <p className="font-medium">Management Level</p>
                      <p className="text-muted-foreground">{assessment.demographics.managementLevel}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.companySize && (
                    <div>
                      <p className="font-medium">Company Size</p>
                      <p className="text-muted-foreground">{assessment.demographics.companySize}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.jobRole && (
                    <div>
                      <p className="font-medium">Job Role</p>
                      <p className="text-muted-foreground">{assessment.demographics.jobRole}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.location && (
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{assessment.demographics.location}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.ageRange && (
                    <div>
                      <p className="font-medium">Age Range</p>
                      <p className="text-muted-foreground">{assessment.demographics.ageRange}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.genderIdentity && (
                    <div>
                      <p className="font-medium">Gender Identity</p>
                      <p className="text-muted-foreground">{assessment.demographics.genderIdentity}</p>
                    </div>
                  )}
                  
                  {assessment.demographics.raceEthnicity && assessment.demographics.raceEthnicity.length > 0 && (
                    <div>
                      <p className="font-medium">Race/Ethnicity</p>
                      <p className="text-muted-foreground">{assessment.demographics.raceEthnicity.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
