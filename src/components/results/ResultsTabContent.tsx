
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
  onExportPDF?: () => void;
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
        <ComparisonTabContent assessment={assessment} assessments={assessments} />
      </TabsContent>
      
      <TabsContent value="report" className="mt-0">
        <ReportTabContent 
          assessment={assessment} 
          reportRef={reportRef} 
          onExportPDF={onExportPDF} 
          exportingPdf={exportingPdf}
        />
      </TabsContent>
      
      <TabsContent value="development" className="mt-0">
        <DevelopmentTabContent 
          assessment={assessment} 
          topDevelopmentArea={topDevelopmentArea} 
        />
      </TabsContent>
      
      <TabsContent value="habits" className="mt-0">
        <HabitTabContent assessment={assessment} dimensionToFocus={topDevelopmentArea} />
      </TabsContent>
    </>
  );
};

export default ResultsTabContent;
