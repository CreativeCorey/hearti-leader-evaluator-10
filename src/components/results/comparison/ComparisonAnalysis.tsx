
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { HEARTIDimension } from '@/types';

interface ComparisonAnalysisProps {
  sortedDimensions: HEARTIDimension[];
  assessment: any;
  compareMode: 'none' | 'average' | 'men' | 'women';
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  aggregateData: {
    averageScores: Record<HEARTIDimension, number>;
    demographics: {
      gender: {
        men: Record<HEARTIDimension, number>;
        women: Record<HEARTIDimension, number>;
      };
    };
  };
}

const ComparisonAnalysis: React.FC<ComparisonAnalysisProps> = ({
  sortedDimensions,
  assessment,
  compareMode,
  getComparisonLabel,
  getComparisonColor,
  aggregateData
}) => {
  
  const getBadgeVariant = (score: number) => {
    if (score >= 4.5) return "default";
    if (score >= 3.5) return "secondary";
    if (score >= 2.5) return "outline";
    return "destructive";
  };
  
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
                  <Badge variant="outline" style={{ color: getComparisonColor(), borderColor: getComparisonColor() }}>
                    {getComparisonLabel()}: {comparisonScore}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Your score is {differenceText} the {getComparisonLabel().toLowerCase()} score.
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonAnalysis;
