
import React, { useState } from 'react';
import { HEARTIAssessment } from '@/types';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import ReportCarousel from './report/carousel/ReportCarousel';
import DesktopReportView from './report/desktop/DesktopReportView';
import MobilePagination from './report/mobile/MobilePagination';
import ReportActionButtons from './report/ReportActionButtons';

interface ReportTabProps {
  assessment: HEARTIAssessment;
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
}

const ReportTab: React.FC<ReportTabProps> = ({ 
  assessment,
  reportRef, 
  onExportPDF,
  exportingPdf
}) => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Object.keys(assessment.dimensionScores).length + 2; // Header, Charts, 6 Dimensions, Footer
  
  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <ReportActionButtons 
        assessment={assessment}
        onExportPDF={onExportPDF}
        exportingPdf={exportingPdf}
        isMobile={isMobile}
      />
      
      {/* Mobile pagination indicator */}
      {isMobile && (
        <MobilePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      
      <Card className="p-3 sm:p-6 w-full">
        <div className="pdf-container w-full" ref={reportRef}>
          {/* For desktop, render everything as before */}
          {!isMobile ? (
            <DesktopReportView assessment={assessment} />
          ) : (
            /* For mobile, render a carousel */
            <ReportCarousel 
              assessment={assessment}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportTab;
