
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDimensionReportContent } from '@/utils/calculations';

interface DimensionCardProps {
  dimension: HEARTIDimension;
  assessment: HEARTIAssessment;
  status: 'strength' | 'vulnerability' | 'neutral';
  userName: string;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ dimension, assessment, status, userName }) => {
  const score = assessment.dimensionScores[dimension];
  const { statusContent, description, levels, tips } = getDimensionReportContent(dimension, status, userName);

  return (
    <Card className="mb-8 overflow-hidden">
      <div className={`p-4 text-white ${
        status === 'strength' ? 'bg-green-600' : 
        status === 'vulnerability' ? 'bg-amber-600' : 
        'bg-blue-600'
      }`}>
        <h3 className="text-xl font-bold uppercase">{dimension}</h3>
        <div className="flex items-center mt-1">
          <Badge className="text-sm py-0.5 px-2 bg-white text-gray-800">
            Score: {score}/5
          </Badge>
          <span className="ml-2 text-sm">
            {status === 'strength' ? '(Strength)' : 
             status === 'vulnerability' ? '(Vulnerability)' : 
             '(Competent)'}
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="prose max-w-none">
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: statusContent }} />
          
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: description }} />
          
          {levels && (
            <div className="mb-4">
              <h4 className="text-lg font-medium uppercase mb-2">{dimension}</h4>
              <div dangerouslySetInnerHTML={{ __html: levels }} />
            </div>
          )}
          
          {tips && (
            <div>
              <h4 className="text-lg font-medium mb-2">Tips for increasing your {dimension} leadership:</h4>
              <div dangerouslySetInnerHTML={{ __html: tips }} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionCard;
