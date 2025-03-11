
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';

interface DimensionSorterProps {
  assessment: HEARTIAssessment;
}

// This component renders a hidden div and exports a utility function
// The component is needed to maintain compatibility with existing code
const DimensionSorter: React.FC<DimensionSorterProps> = ({ assessment }) => {
  const sortedDimensions = getSortedDimensions(assessment);
    
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
