
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScoreCardProps {
  assessment: HEARTIAssessment;
  formattedDate: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ assessment, formattedDate }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your HEARTI:Leader Quotient</CardTitle>
        <CardDescription>Assessment completed on {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="text-muted-foreground">Overall Score</p>
            <div className="flex items-center justify-center relative">
              {/* Oval background for the score */}
              <div className="absolute w-16 h-8 bg-orange-100 rounded-full -z-10"></div>
              <span className="text-4xl font-bold">{assessment.overallScore}</span>
              <span className="text-muted-foreground ml-1">/5</span>
            </div>
            <p className="text-sm text-center max-w-[220px]">Your HEARTI:Leader Quotient indicates your overall proficiency in the skills needed for 21st century leadership.</p>
          </div>
          
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="text-muted-foreground">Top Strength</p>
            <div className="flex items-center gap-2 justify-center">
              {Object.entries(assessment.dimensionScores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 1)
                .map(([dimension, score]) => (
                  <div key={dimension} className="space-y-1 flex flex-col items-center">
                    <p className="font-medium capitalize">{dimension}</p>
                    <Badge variant="default" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                  </div>
                ))}
            </div>
            <p className="text-sm text-center max-w-[220px]">This is your highest-scoring HEARTI dimension.</p>
          </div>
          
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="text-muted-foreground">Development Area</p>
            <div className="flex items-center gap-2 justify-center">
              {Object.entries(assessment.dimensionScores)
                .sort(([, a], [, b]) => a - b)
                .slice(0, 1)
                .map(([dimension, score]) => (
                  <div key={dimension} className="space-y-1 flex flex-col items-center">
                    <p className="font-medium capitalize">{dimension}</p>
                    <Badge variant="outline" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                  </div>
                ))}
            </div>
            <p className="text-sm text-center max-w-[220px]">This dimension has the most potential for growth.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
