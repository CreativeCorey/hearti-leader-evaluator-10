
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ReportTab from '../ReportTab';
import TabHeader from './TabHeader';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ReportTabContentProps {
  assessment: HEARTIAssessment;
  assessments: HEARTIAssessment[]; 
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({
  assessment,
  assessments = [], 
  reportRef,
  onExportPDF,
  exportingPdf
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <>
      {!isMobile && (
        <TabHeader
          title={t('tabs.report')}
          description={t('results.report.description')}
          showExportButton={false}
        />
      )}
      
      <div className={`space-y-4 ${isMobile ? 'p-2' : 'p-4'}`}>
        <ReportTab 
          assessment={assessment}
          assessments={assessments}
          reportRef={reportRef}
          onExportPDF={onExportPDF}
          exportingPdf={exportingPdf}
          showExportButton={false}
        />
      </div>
    </>
  );
};

export default ReportTabContent;
