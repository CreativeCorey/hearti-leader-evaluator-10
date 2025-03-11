
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card } from '@/components/ui/card';
import { dimensionColors } from '../development/DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComparisonAnalysisProps {
  assessment: HEARTIAssessment;
  compareMode: 'none' | 'average';
  sortedDimensions: HEARTIDimension[];
  getComparisonLabel: () => string;
  getComparisonColor: () => string;
  aggregateData: any;
}

const ComparisonAnalysis: React.FC<ComparisonAnalysisProps> = ({
  assessment,
  compareMode,
  sortedDimensions,
  getComparisonLabel,
  getComparisonColor,
  aggregateData
}) => {
  const isMobile = useIsMobile();

  // Skip rendering if no comparison is selected
  if (compareMode === 'none') return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2 text-center">Comparison Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedDimensions.map((dimension: HEARTIDimension) => {
          const userScore = assessment.dimensionScores[dimension];
          const comparisonScore = aggregateData.averageScores[dimension];
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
                    <div className="rounded-full px-3 py-1 text-white text-sm flex items-center justify-center" 
                         style={{ backgroundColor: "#D946EF" }}>
                      <span className="font-semibold">You: {userScore.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-400">|</span>
                    <div className="rounded-full px-3 py-1 text-white text-sm flex items-center justify-center" 
                         style={{ backgroundColor: getComparisonColor() }}>
                      <span className="font-semibold">{getComparisonLabel()}: {comparisonScore.toFixed(1)}</span>
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
                  the {getComparisonLabel().toLowerCase()} score.
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
