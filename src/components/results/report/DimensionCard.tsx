
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDimensionReportContent } from '@/utils/calculations';
import { dimensionIcons } from '../development/DimensionIcons';

interface DimensionCardProps {
  dimension: HEARTIDimension;
  assessment: HEARTIAssessment;
  status: 'strength' | 'vulnerability' | 'neutral';
  userName: string;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ dimension, assessment, status, userName }) => {
  const score = assessment.dimensionScores[dimension];
  const { statusContent, description, levels, tips } = getDimensionReportContent(dimension, status, userName);
  const DimensionIcon = dimensionIcons[dimension];

  // PDF class mapping for dimension headers
  const dimensionHeaderClass = `${dimension.toLowerCase()}-header`;

  return (
    <Card className="mb-8 overflow-hidden pdf-dimension-card">
      <div className={`p-4 text-white pdf-dimension-header ${
        status === 'strength' ? 'bg-green-600' : 
        status === 'vulnerability' ? 'bg-amber-600' : 
        'bg-blue-600'
      } ${dimensionHeaderClass}`}>
        <h3 className="text-xl font-bold uppercase pdf-dimension-title flex items-center gap-2">
          <DimensionIcon size={24} className="text-white" />
          {dimension}
        </h3>
        <div className="flex items-center mt-1">
          <Badge className="text-sm py-0.5 px-2 bg-white text-gray-800 pdf-dimension-score">
            Score: {score}/5
          </Badge>
          <span className="ml-2 text-sm">
            {status === 'strength' ? '(Strength)' : 
             status === 'vulnerability' ? '(Vulnerability)' : 
             '(Competent)'}
          </span>
        </div>
      </div>
      
      <CardContent className="p-6 pdf-dimension-content">
        <div className="prose max-w-none">
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: statusContent }} />
          
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: description }} />
          
          {levels && (
            <div className="mb-4">
              <h4 className="text-lg font-medium uppercase mb-2 flex items-center gap-2">
                <DimensionIcon size={18} className="text-gray-500" />
                {dimension}
              </h4>
              <div dangerouslySetInnerHTML={{ __html: levels }} />
            </div>
          )}
          
          {tips && (
            <div>
              <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                <DimensionIcon size={18} className="text-gray-500" />
                Tips for increasing your {dimension} leadership:
              </h4>
              <div dangerouslySetInnerHTML={{ __html: tips }} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionCard;
