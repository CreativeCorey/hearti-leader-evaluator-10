
import React from 'react';
import { HEARTIAssessment } from '@/types';
import DimensionsTab from '../DimensionsTab';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DimensionsTabContentProps {
  assessment: HEARTIAssessment;
}

const DimensionsTabContent: React.FC<DimensionsTabContentProps> = ({ assessment }) => {
  const { t } = useLanguage();
  
  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-6">
        {t('dimensions.report.analysis.title', { fallback: 'HEARTI Dimension Analysis' })}
      </h2>
      <p className="text-muted-foreground mb-8">
        {t('dimensions.report.analysis.description', { 
          fallback: 'Each dimension below shows your score, competency level, and guidance for your continued development.' 
        })}
      </p>
      
      <DimensionsTab assessment={assessment} />
    </div>
  );
};

export default DimensionsTabContent;
