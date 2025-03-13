
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

  // For Spanish and other languages with long words, use abbreviated versions on mobile
  const getDevelopSkillsTabName = () => {
    if (isMobile) {
      return t('tabs.developSkillsShort');
    }
    return t('tabs.developSkills');
  };

  const getBuildHabitsTabName = () => {
    if (isMobile) {
      return t('tabs.buildHabitsShort');
    }
    return t('tabs.buildHabits');
  };

  // Handle assessment selection (for the progress chart interaction)
  const handleAssessmentSelect = (assessment: HEARTIAssessment) => {
    setSelectedAssessment(assessment);
    if (onSelectAssessment) {
      onSelectAssessment(assessment);
    }
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 gap-1 p-1 h-auto sm:min-h-[40px]">
        <TabsTrigger 
          value="overview" 
          className="text-xs md:text-sm py-1 px-1 sm:px-2 whitespace-normal min-h-[36px] flex items-center justify-center"
        >
          {t('tabs.summary')}
        </TabsTrigger>
        <TabsTrigger 
          value="dimensions" 
          className="text-xs md:text-sm py-1 px-1 sm:px-2 whitespace-normal min-h-[36px] flex items-center justify-center"
        >
          {t('tabs.dimensions')}
        </TabsTrigger>
        <TabsTrigger 
          value="comparison" 
          className="text-xs md:text-sm py-1 px-1 sm:px-2 whitespace-normal min-h-[36px] flex items-center justify-center"
        >
          {getDataVizTabName()}
        </TabsTrigger>
        <TabsTrigger 
          value="report" 
          className="text-xs md:text-sm py-1 px-1 sm:px-2 whitespace-normal min-h-[36px] flex items-center justify-center"
        >
          {t('tabs.guide')}
        </TabsTrigger>
        <TabsTrigger 
          value="development" 
          className="text-xs md:text-sm py-1 px-1 sm:px-2 whitespace-normal min-h-[36px] flex items-center justify-center hyphens-auto"
        >
          {getDevelopSkillsTabName()}
        </TabsTrigger>
        <TabsTrigger 
          value="habits" 
          className="text-xs md:text-sm py-1 px-1 sm:px-2 whitespace-normal min-h-[36px] flex items-center justify-center"
        >
          {getBuildHabitsTabName()}
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
