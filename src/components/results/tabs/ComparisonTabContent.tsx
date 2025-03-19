
import React, { useState } from 'react';
import { HEARTIAssessment } from '@/types';
import ComparisonTab from '../ComparisonTab';
import TabHeader from './TabHeader';
import ProgressChart from '../comparison/ProgressChart';
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
        {/* Progress chart section */}
        {assessments.length > 1 && (
          <div className="mt-6">
            <div className="bg-white p-6 rounded-md border">
              <h3 className="text-lg font-medium mb-3">
                {t('results.comparison.progress', { fallback: "HEARTI Progress Over Time" })}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('results.comparison.progressSubtitle', { 
                  fallback: "Select a point on the chart to view that assessment's data" 
                })}
              </p>
              
              <ProgressChart 
                assessments={assessments} 
                onSelectAssessment={handleSelectAssessment}
              />
              
              {assessments.length <= 1 && (
                <p className="text-center text-muted-foreground mt-6">
                  {t('results.comparison.noProgressData', { 
                    fallback: "Complete more assessments to see your progress over time." 
                  })}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Main comparison content */}
        <ComparisonTab 
          assessment={selectedAssessment} 
          assessments={assessments}
        />
      </div>
    </>
  );
};

export default ComparisonTabContent;
