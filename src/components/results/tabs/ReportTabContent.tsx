
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ReportTab from '../ReportTab';
import TabHeader from './TabHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReportTabContentProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[]; // Added assessments property
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({
  assessment,
  assessments = [], // Added default value
  reportRef,
  onExportPDF,
  exportingPdf
}) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {!isMobile && (
        <TabHeader
          title="HEARTI:Leader Quotient Report"
          description="Measuring Leadership Competencies Designed for the New World of Work"
          showExportButton
          onExportPDF={onExportPDF}
          exportingPdf={exportingPdf}
        />
      )}
      
      <div className={`space-y-4 ${isMobile ? 'p-2' : 'p-4'}`}>
        <ReportTab 
          assessment={assessment}
          assessments={assessments} // Pass assessments to ReportTab
          reportRef={reportRef}
          onExportPDF={onExportPDF}
          exportingPdf={exportingPdf}
        />
      </div>
    </>
  );
};

export default ReportTabContent;
