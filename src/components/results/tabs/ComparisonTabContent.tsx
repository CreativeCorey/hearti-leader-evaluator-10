
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ComparisonTab from '../ComparisonTab';

interface ComparisonTabContentProps {
  assessment: HEARTIAssessment;
}

const ComparisonTabContent: React.FC<ComparisonTabContentProps> = ({ assessment }) => {
  return <ComparisonTab assessment={assessment} />;
};

export default ComparisonTabContent;
