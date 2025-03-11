
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

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
  const { t } = useLanguage();
  
  return (
    <div className={`flex ${isMobile ? 'flex-wrap' : 'flex-row space-x-3'} justify-end mb-4`}>
      <Button
        size={isMobile ? "sm" : "default"}
        variant="outline"
        className={`pdf-export-button ${isMobile ? 'text-xs py-1.5 px-2 h-8' : ''}`}
        onClick={onExportPDF}
        disabled={exportingPdf}
      >
        <Download size={isMobile ? 14 : 16} className={isMobile ? "mr-1" : "mr-1.5"} />
        {exportingPdf ? t('results.report.exporting') : t('results.report.export')}
      </Button>
    </div>
  );
};

export default ReportActionButtons;
