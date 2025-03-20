
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { HEARTIAssessment } from '@/types';
import OverviewTab from './OverviewTab';
import DimensionsTab from './DimensionsTab';
import ComparisonTabContent from './tabs/ComparisonTabContent';
import ReportTabContent from './tabs/ReportTabContent';
import DevelopmentTabContent from './tabs/DevelopmentTabContent';
import HabitTabContent from './tabs/HabitTabContent';

interface ResultsTabContentProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
  reportRef?: React.RefObject<HTMLDivElement>;
  onExportPDF?: () => Promise<void>;
  exportingPdf?: boolean;
  topDevelopmentArea?: 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity';
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const ResultsTabContent: React.FC<ResultsTabContentProps> = ({ 
  assessment, 
  assessments = [],
  reportRef,
  onExportPDF,
  exportingPdf = false,
  topDevelopmentArea = 'humility',
  onSelectAssessment
}) => {
  // Create a Promise-returning function for the PDF export
  const handleExportPDF = async () => {
    if (onExportPDF) {
      await onExportPDF();
    }
    return Promise.resolve();
  };

  return (
    <>
      <TabsContent value="overview" className="mt-0">
        <OverviewTab 
          assessment={assessment} 
          assessments={assessments}
          onSelectAssessment={onSelectAssessment}
        />
      </TabsContent>
      
      <TabsContent value="dimensions" className="mt-0">
        <DimensionsTab assessment={assessment} />
      </TabsContent>
      
      <TabsContent value="comparison" className="mt-0">
        <ComparisonTabContent 
          assessment={assessment} 
          assessments={assessments} 
        />
      </TabsContent>
      
      <TabsContent value="report" className="mt-0">
        <ReportTabContent 
          assessment={assessment} 
          assessments={assessments}
          reportRef={reportRef} 
          onExportPDF={handleExportPDF} 
          exportingPdf={exportingPdf}
        />
      </TabsContent>
      
      <TabsContent value="development" className="mt-0">
        <DevelopmentTabContent 
          topDevelopmentArea={topDevelopmentArea} 
        />
      </TabsContent>
      
      <TabsContent value="habits" className="mt-0">
        <HabitTabContent topDevelopmentArea={topDevelopmentArea} />
      </TabsContent>
    </>
  );
};

export default ResultsTabContent;
