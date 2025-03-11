
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';

interface DimensionSorterProps {
  assessment: HEARTIAssessment;
}

const DimensionSorter: React.FC<DimensionSorterProps> = ({ assessment }) => {
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
    
  return { sortedDimensions };
};

export default DimensionSorter;
