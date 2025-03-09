
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ReportTab from '../ReportTab';
import TabHeader from './TabHeader';

interface ReportTabContentProps {
  assessment: HEARTIAssessment;
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({
  assessment,
  reportRef,
  onExportPDF,
  exportingPdf
}) => {
  return (
    <>
      <TabHeader
        title="HEARTI:Leader Quotient Report"
        description="Measuring Leadership Competencies Designed for the New World of Work"
        showExportButton
        onExportPDF={onExportPDF}
        exportingPdf={exportingPdf}
      />
      
      <div className="space-y-4 p-4">
        <ReportTab 
          assessment={assessment} 
          reportRef={reportRef}
          onExportPDF={onExportPDF}
          exportingPdf={exportingPdf}
        />
      </div>
    </>
  );
};

export default ReportTabContent;
