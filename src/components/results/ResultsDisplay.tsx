
import React, { useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [exportingPdf, setExportingPdf] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<HEARTIAssessment>(assessment);
  const reportRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
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
  
  // Use mobile or desktop version of the tab name based on device
  const getDataVizTabName = () => {
    return isMobile ? 
      t('tabs.dataViz.mobile') : 
      t('tabs.dataViz.desktop');
  };

  // Handle assessment selection (for the progress chart interaction)
  const handleAssessmentSelect = (assessment: HEARTIAssessment) => {
    setSelectedAssessment(assessment);
    if (onSelectAssessment) {
      onSelectAssessment(assessment);
    }
  };
  
  // Determine tab classes based on screen size
  const getTabClasses = () => {
    const baseClasses = "whitespace-nowrap";
    if (isMobile) {
      return `text-xs ${baseClasses} px-2 py-1.5`;  // Smaller padding on mobile
    }
    return `text-xs md:text-sm ${baseClasses}`;
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 gap-1 p-1 h-auto flex-wrap">
        <TabsTrigger value="overview" className={getTabClasses()}>
          {t('tabs.summary')}
        </TabsTrigger>
        <TabsTrigger value="dimensions" className={getTabClasses()}>
          {t('tabs.dimensions')}
        </TabsTrigger>
        <TabsTrigger value="comparison" className={getTabClasses()}>
          {getDataVizTabName()}
        </TabsTrigger>
        <TabsTrigger value="report" className={getTabClasses()}>
          {t('tabs.report')}
        </TabsTrigger>
        <TabsTrigger value="development" className={getTabClasses()}>
          {t('tabs.developSkills')}
        </TabsTrigger>
        <TabsTrigger value="habits" className={getTabClasses()}>
          {t('tabs.buildHabits')}
        </TabsTrigger>
      </TabsList>
      
      <ResultsTabContent 
        assessment={selectedAssessment}
        assessments={assessments}
        reportRef={reportRef}
        onExportPDF={handleExportPDF}
        exportingPdf={exportingPdf}
        topDevelopmentArea={topDevelopmentArea}
        onSelectAssessment={handleAssessmentSelect}
      />
    </Tabs>
  );
};

export default ResultsDisplay;
