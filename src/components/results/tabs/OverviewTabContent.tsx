
import React from 'react';
import { HEARTIAssessment } from '@/types';
import OverviewTab from '../OverviewTab';

interface OverviewTabContentProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({ 
  assessment,
  assessments = [],
  onSelectAssessment 
}) => {
  return (
    <OverviewTab 
      assessment={assessment} 
      assessments={assessments}
      onSelectAssessment={onSelectAssessment}
    />
  );
};

export default OverviewTabContent;
