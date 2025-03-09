
import React from 'react';
import { HEARTIAssessment } from '@/types';
import OverviewTab from '../OverviewTab';

interface OverviewTabContentProps {
  assessment: HEARTIAssessment;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({ assessment }) => {
  return <OverviewTab assessment={assessment} />;
};

export default OverviewTabContent;
