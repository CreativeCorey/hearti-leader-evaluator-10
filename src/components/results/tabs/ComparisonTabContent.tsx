
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ComparisonTab from '../ComparisonTab';
import TabHeader from './TabHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ComparisonTabContentProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
}

const ComparisonTabContent: React.FC<ComparisonTabContentProps> = ({
  assessment,
  assessments = []
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <div className={isMobile ? 'pb-16' : ''}>
      {!isMobile && (
        <TabHeader
          title="HEARTI:Leader Spectra"
          description={t('results.comparison.description')}
        />
      )}
      
      <div className={`space-y-4 ${isMobile ? 'p-2' : 'p-4'}`}>
        <ComparisonTab assessment={assessment} assessments={assessments} />
      </div>
    </div>
  );
};

export default ComparisonTabContent;
