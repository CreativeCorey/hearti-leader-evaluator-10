
import React, { useState, useRef } from 'react';
import { HEARTIAssessment } from '@/types';
import ResultsTabContent from './ResultsTabContent';
import { exportToPDF } from './export';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultsDisplayProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  assessment, 
  assessments = [],
  onSelectAssessment
}) => {
  const [exportingPdf, setExportingPdf] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<HEARTIAssessment>(assessment);
  const reportRef = useRef<HTMLDivElement>(null);
  const { t, currentLanguage } = useLanguage();
  const isMobile = useIsMobile();
  
  // Get top development area (lowest scoring dimension)
  const dimensionScores = selectedAssessment.dimensionScores;
  const topDevelopmentArea = 
    Object.entries(dimensionScores)
      .sort(([, a], [, b]) => a - b)[0][0] as 
      'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity';
  
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setExportingPdf(true);
    try {
      await exportToPDF(reportRef.current, selectedAssessment);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setExportingPdf(false);
    }
  };

  // Handle assessment selection (for the progress chart interaction)
  const handleAssessmentSelect = (assessment: HEARTIAssessment) => {
    setSelectedAssessment(assessment);
    if (onSelectAssessment) {
      onSelectAssessment(assessment);
    }
  };
  
  return (
    <div className="space-y-6">
      <ResultsTabContent 
        assessment={selectedAssessment}
        assessments={assessments}
        reportRef={reportRef}
        onExportPDF={handleExportPDF}
        exportingPdf={exportingPdf}
        topDevelopmentArea={topDevelopmentArea}
        onSelectAssessment={handleAssessmentSelect}
      />
    </div>
  );
};

export default ResultsDisplay;
