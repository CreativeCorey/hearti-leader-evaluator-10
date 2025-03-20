
import React, { useState } from 'react';
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
  const [selectedAssessment, setSelectedAssessment] = useState<HEARTIAssessment>(assessment);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Get proper translations with fallbacks
  const title = t('results.comparison.title', { fallback: "HEARTI Comparison" });
  const description = t('results.comparison.subtitle', { fallback: "Compare your results with global benchmarks" });
  
  // Handle assessment selection
  const handleSelectAssessment = (assessment: HEARTIAssessment) => {
    setSelectedAssessment(assessment);
  };
  
  return (
    <>
      {!isMobile && (
        <TabHeader 
          title={title}
          description={description}
        />
      )}
      
      <div className="space-y-8">
        {/* Main comparison content */}
        <ComparisonTab 
          assessment={selectedAssessment} 
          assessments={assessments}
          onSelectAssessment={handleSelectAssessment}
        />
      </div>
    </>
  );
};

export default ComparisonTabContent;
