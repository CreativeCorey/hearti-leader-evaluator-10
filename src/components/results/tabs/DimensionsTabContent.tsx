
import React from 'react';
import { HEARTIAssessment } from '@/types';
import DimensionsTab from '../DimensionsTab';

interface DimensionsTabContentProps {
  assessment: HEARTIAssessment;
}

const DimensionsTabContent: React.FC<DimensionsTabContentProps> = ({ assessment }) => {
  return <DimensionsTab assessment={assessment} />;
};

export default DimensionsTabContent;
