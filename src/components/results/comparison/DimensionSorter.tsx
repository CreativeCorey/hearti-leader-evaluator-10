
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';

interface DimensionSorterProps {
  assessment: HEARTIAssessment;
}

// A utility function to sort dimensions
export const getSortedDimensions = (assessment: HEARTIAssessment): HEARTIDimension[] => {
  if (!assessment || !assessment.dimensionScores) return [];
  
  return Object.entries(assessment.dimensionScores)
    .sort((a, b) => b[1] - a[1])
    .map(([dimension]) => dimension as HEARTIDimension);
};

// The component now returns JSX for display, with the sorted dimensions computed via the utility function
const DimensionSorter: React.FC<DimensionSorterProps> = ({ assessment }) => {
  // Sort dimensions by score (highest to lowest)
  const sortedDimensions = getSortedDimensions(assessment);
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Dimensions by Strength</h3>
      <div className="flex flex-wrap gap-2">
        {sortedDimensions.map((dimension, index) => (
          <div key={dimension} className="px-3 py-1 bg-primary/10 rounded-full">
            <span className="font-medium">{index + 1}.</span> {dimension}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DimensionSorter;
