
import React, { useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIAssessment } from '@/types';
import ResultsTabContent from './ResultsTabContent';
import { exportToPDF } from './ResultsExportPDF';

interface ResultsDisplayProps {
  assessment: HEARTIAssessment;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ assessment }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [exportingPdf, setExportingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
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
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 gap-1 p-1 h-auto flex-wrap">
        <TabsTrigger value="overview" className="text-xs md:text-sm whitespace-nowrap">
          Overview
        </TabsTrigger>
        <TabsTrigger value="dimensions" className="text-xs md:text-sm whitespace-nowrap">
          Dimensions
        </TabsTrigger>
        <TabsTrigger value="comparison" className="text-xs md:text-sm whitespace-nowrap">
          Comparisons
        </TabsTrigger>
        <TabsTrigger value="report" className="text-xs md:text-sm whitespace-nowrap">
          Full Report
        </TabsTrigger>
        <TabsTrigger value="habits" className="text-xs md:text-sm whitespace-nowrap">
          Build Habits
        </TabsTrigger>
        <TabsTrigger value="development" className="text-xs md:text-sm whitespace-nowrap">
          Development
        </TabsTrigger>
      </TabsList>
      
      <ResultsTabContent 
        assessment={assessment}
        reportRef={reportRef}
        onExportPDF={handleExportPDF}
        exportingPdf={exportingPdf}
        topDevelopmentArea={topDevelopmentArea}
      />
    </Tabs>
  );
};

export default ResultsDisplay;
