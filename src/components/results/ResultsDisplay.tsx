
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
  const reportRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Get top development area (lowest scoring dimension)
  const dimensionScores = assessment.dimensionScores;
  const topDevelopmentArea = 
    Object.entries(dimensionScores)
      .sort(([, a], [, b]) => a - b)[0][0] as 
      'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity';
  
  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    
    setExportingPdf(true);
    try {
      await exportToPDF(reportRef.current, assessment);
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
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 gap-1 p-1 h-auto flex-wrap">
        <TabsTrigger value="overview" className="text-xs md:text-sm whitespace-nowrap">
          {t('tabs.summary')}
        </TabsTrigger>
        <TabsTrigger value="dimensions" className="text-xs md:text-sm whitespace-nowrap">
          {t('tabs.dimensions')}
        </TabsTrigger>
        <TabsTrigger value="comparison" className="text-xs md:text-sm whitespace-nowrap">
          {getDataVizTabName()}
        </TabsTrigger>
        <TabsTrigger value="report" className="text-xs md:text-sm whitespace-nowrap">
          {t('tabs.guide')}
        </TabsTrigger>
        <TabsTrigger value="development" className="text-xs md:text-sm whitespace-nowrap">
          {t('tabs.developSkills')}
        </TabsTrigger>
        <TabsTrigger value="habits" className="text-xs md:text-sm whitespace-nowrap">
          {t('tabs.buildHabits')}
        </TabsTrigger>
      </TabsList>
      
      <ResultsTabContent 
        assessment={assessment}
        assessments={assessments}
        reportRef={reportRef}
        onExportPDF={handleExportPDF}
        exportingPdf={exportingPdf}
        topDevelopmentArea={topDevelopmentArea}
        onSelectAssessment={onSelectAssessment}
      />
    </Tabs>
  );
};

export default ResultsDisplay;
