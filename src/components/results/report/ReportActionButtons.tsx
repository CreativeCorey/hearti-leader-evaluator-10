import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

// This component is no longer used in the application
// Keeping it simple for potential future use

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
      {/* Export button removed as per requirements */}
    </div>
  );
};

export default ReportActionButtons;
