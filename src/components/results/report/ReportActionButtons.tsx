
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import LinkedInBadge from '../sharing/LinkedInBadge';

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
        <div className="flex gap-2">
          <Button 
            onClick={onExportPDF} 
            disabled={exportingPdf}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            {exportingPdf ? "Generating PDF..." : "Export PDF"}
          </Button>
        </div>
      </div>
      
      {/* Action buttons in a full-width container before the card */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-end mb-4">
        <LinkedInBadge assessment={assessment} />
      </div>
    </>
  );
};

export default ReportActionButtons;
