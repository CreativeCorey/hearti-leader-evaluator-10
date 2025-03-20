
import React from 'react';
import { HEARTIDimension, HEARTIAssessment } from '@/types';
import DevelopmentTab from '../DevelopmentTab';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DevelopmentTabContentProps {
  topDevelopmentArea: HEARTIDimension;
  assessments?: HEARTIAssessment[];
  dimensionScores?: Record<HEARTIDimension, number>;
}

const DevelopmentTabContent: React.FC<DevelopmentTabContentProps> = ({ 
  topDevelopmentArea, 
  assessments = [],
  dimensionScores
}) => {
  const { t } = useLanguage();
  return <DevelopmentTab 
    focusDimension={topDevelopmentArea} 
    assessments={assessments} 
    dimensionScores={dimensionScores}
  />;
};

export default DevelopmentTabContent;
