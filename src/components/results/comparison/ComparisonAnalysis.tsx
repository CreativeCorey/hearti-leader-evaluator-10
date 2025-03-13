
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card } from '@/components/ui/card';
import { dimensionColors } from '../development/DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComparisonAnalysisProps {
  assessment: HEARTIAssessment;
  averageScores?: Record<HEARTIDimension, number>;
  comparisonLabel: string;
  comparisonColor: string;
}

const ComparisonAnalysis: React.FC<ComparisonAnalysisProps> = ({
  assessment,
  averageScores,
  comparisonLabel,
  comparisonColor
}) => {
  const isMobile = useIsMobile();

  // Skip rendering if no comparison data is provided
  if (!averageScores) return null;

  // Sort dimensions by score difference (largest to smallest)
  const sortedDimensions = Object.keys(assessment.dimensionScores)
    .sort((a, b) => {
      const aScore = assessment.dimensionScores[a as HEARTIDimension];
      const bScore = assessment.dimensionScores[b as HEARTIDimension];
      const aCompare = averageScores[a as HEARTIDimension];
      const bCompare = averageScores[b as HEARTIDimension];
      return Math.abs(bScore - bCompare) - Math.abs(aScore - aCompare);
    }) as HEARTIDimension[];

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-medium mb-2 text-center">Comparison Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedDimensions.map((dimension: HEARTIDimension) => {
          const userScore = assessment.dimensionScores[dimension];
          const comparisonScore = averageScores[dimension];
          const difference = userScore - comparisonScore;
          const isHigher = difference > 0;
          
          // Get dimension-specific color
          const dimensionColor = dimensionColors[dimension];
          
          return (
            <Card key={dimension} className="overflow-hidden border-t-4" style={{ borderTopColor: dimensionColor }}>
              <div className="p-4">
                <div className="flex flex-col mb-3">
                  <h4 className="text-lg font-semibold capitalize">{dimension}</h4>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="text-sm font-semibold" style={{ color: "#D946EF" }}>
                      You: {userScore.toFixed(1)}
                    </div>
                    <span className="text-gray-400">|</span>
                    <div className="text-sm font-semibold" style={{ color: comparisonColor }}>
                      {comparisonLabel}: {comparisonScore.toFixed(1)}
                    </div>
                  </div>
                </div>
                
                <div className="relative h-2 bg-gray-200 rounded-full mb-3">
                  <div className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" 
                       style={{ width: `${(userScore / 5) * 100}%` }}></div>
                  <div className="absolute top-0 h-2 w-1 bg-purple-600 rounded-full" 
                       style={{ left: `${(comparisonScore / 5) * 100}%` }}></div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Your score is {Math.abs(difference).toFixed(1)} {isHigher ? 'higher' : 'lower'} than 
                  the {comparisonLabel.toLowerCase()} score.
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonAnalysis;
