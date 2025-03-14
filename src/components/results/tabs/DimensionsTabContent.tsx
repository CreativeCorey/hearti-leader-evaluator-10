
import React from 'react';
import { HEARTIAssessment } from '@/types';
import DimensionsTab from '../DimensionsTab';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DimensionsTabContentProps {
  assessment: HEARTIAssessment;
}

const DimensionsTabContent: React.FC<DimensionsTabContentProps> = ({ assessment }) => {
  const { t } = useLanguage();
  return <DimensionsTab assessment={assessment} />;
};

export default DimensionsTabContent;
