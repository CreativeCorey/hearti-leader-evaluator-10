
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';

interface DimensionSorterProps {
  assessment: HEARTIAssessment;
}

const DimensionSorter: React.FC<DimensionSorterProps> = ({ assessment }) => {
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
    
  return (
    <div className="hidden">
      {/* This component doesn't render anything visible, it's used to compute sorted dimensions */}
      <span data-sorted-dimensions={sortedDimensions.join(',')}></span>
    </div>
  );
};

// Export the utility function separately for components that just need the calculation
export const getSortedDimensions = (assessment: HEARTIAssessment): HEARTIDimension[] => {
  return Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
};

export default DimensionSorter;
