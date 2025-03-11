
import React from 'react';
import { HEARTIDimension, HEARTIAssessment } from '@/types';
import DevelopmentTab from '../DevelopmentTab';

interface DevelopmentTabContentProps {
  topDevelopmentArea: HEARTIDimension;
  assessments?: HEARTIAssessment[];
}

const DevelopmentTabContent: React.FC<DevelopmentTabContentProps> = ({ 
  topDevelopmentArea, 
  assessments = []
}) => {
  return <DevelopmentTab focusDimension={topDevelopmentArea} assessments={assessments} />;
};

export default DevelopmentTabContent;
