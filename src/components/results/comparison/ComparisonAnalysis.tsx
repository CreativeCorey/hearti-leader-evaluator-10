
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { aggregateData } from '@/data/comparisonData';
import { getBadgeVariant, getComparisonColor, getComparisonLabel } from './SpiderChartConfig';

interface ComparisonAnalysisProps {
  assessment: HEARTIAssessment;
  compareMode: 'none' | 'average' | 'men' | 'women';
  sortedDimensions: HEARTIDimension[];
}

const ComparisonAnalysis: React.FC<ComparisonAnalysisProps> = ({
  assessment,
  compareMode,
  sortedDimensions
}) => {
  if (compareMode === 'none') return null;
  
  return (
    <div className="mt-6">
      <h4 className="text-md font-medium mb-2">Comparison Analysis</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedDimensions.map((dimension) => {
          const userScore = assessment.dimensionScores[dimension];
          let comparisonScore = 0;
          
          if (compareMode === 'average') {
            comparisonScore = aggregateData.averageScores[dimension];
          } else if (compareMode === 'men') {
            comparisonScore = aggregateData.demographics.gender.men[dimension];
          } else if (compareMode === 'women') {
            comparisonScore = aggregateData.demographics.gender.women[dimension];
          }
          
          const difference = userScore - comparisonScore;
          const differenceText = difference > 0 
            ? `${difference.toFixed(1)} higher than` 
            : difference < 0 
              ? `${Math.abs(difference).toFixed(1)} lower than` 
              : 'same as';
              
          return (
            <div key={dimension} className="p-3 bg-white rounded-md border">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</span>
                <div className="flex gap-2 items-center">
                  <Badge variant={getBadgeVariant(userScore)}>
                    You: {userScore}
                  </Badge>
                  <span className="text-gray-500">|</span>
                  <Badge variant="outline" style={{ color: getComparisonColor(compareMode), borderColor: getComparisonColor(compareMode) }}>
                    {getComparisonLabel(compareMode)}: {comparisonScore}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Your score is {differenceText} the {getComparisonLabel(compareMode).toLowerCase()} score.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonAnalysis;
