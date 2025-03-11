
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import ShareButton from '../sharing/ShareButton';

interface ReportActionButtonsProps {
  assessment: HEARTIAssessment;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
  isMobile: boolean;
}

const ReportActionButtons: React.FC<ReportActionButtonsProps> = ({
  assessment,
  onExportPDF,
  exportingPdf,
  isMobile
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">HEARTI:Leader Report</h2>
        
        {/* Action buttons group - always side-by-side */}
        <div className="flex gap-2">
          <Button 
            onClick={onExportPDF} 
            disabled={exportingPdf}
            className="flex items-center gap-2"
            size={isMobile ? "sm" : "default"}
          >
            <Download size={16} />
            {exportingPdf ? (isMobile ? "Generating..." : "Generating PDF...") : (isMobile ? "Export" : "Export PDF")}
          </Button>
          
          <ShareButton 
            assessment={assessment} 
            variant="outline"
            size={isMobile ? "sm" : "default"}
          />
        </div>
      </div>
    </>
  );
};

export default ReportActionButtons;
