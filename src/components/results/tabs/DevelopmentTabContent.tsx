
import React from 'react';
import { HEARTIDimension, HEARTIAssessment } from '@/types';
import DevelopmentTab from '../DevelopmentTab';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DevelopmentTabContentProps {
  topDevelopmentArea: HEARTIDimension;
  assessments?: HEARTIAssessment[];
}

const DevelopmentTabContent: React.FC<DevelopmentTabContentProps> = ({ 
  topDevelopmentArea, 
  assessments = []
}) => {
  const { t } = useLanguage();
  return <DevelopmentTab focusDimension={topDevelopmentArea} assessments={assessments} />;
};

export default DevelopmentTabContent;
