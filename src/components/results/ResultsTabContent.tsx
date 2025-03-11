
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { TabsContent } from '@/components/ui/tabs';
import {
  OverviewTabContent,
  DimensionsTabContent,
  ComparisonTabContent,
  ReportTabContent,
  DevelopmentTabContent,
  HabitTabContent
} from './tabs';

interface ResultsTabContentProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
  topDevelopmentArea: HEARTIDimension;
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const ResultsTabContent: React.FC<ResultsTabContentProps> = ({ 
  assessment,
  assessments = [],
  reportRef, 
  onExportPDF, 
  exportingPdf,
  topDevelopmentArea,
  onSelectAssessment
}) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <OverviewTabContent 
          assessment={assessment} 
          onSelectAssessment={onSelectAssessment}
        />
      </TabsContent>
      
      <TabsContent value="dimensions" className="space-y-6">
        <DimensionsTabContent assessment={assessment} />
      </TabsContent>
      
      <TabsContent value="comparison" className="space-y-6">
        <ComparisonTabContent assessment={assessment} assessments={assessments} />
      </TabsContent>
      
      <TabsContent value="report" className="space-y-6">
        <ReportTabContent 
          assessment={assessment}
          assessments={assessments}
          reportRef={reportRef}
          onExportPDF={onExportPDF}
          exportingPdf={exportingPdf}
        />
      </TabsContent>
      
      <TabsContent value="development" className="space-y-6">
        <DevelopmentTabContent 
          topDevelopmentArea={topDevelopmentArea} 
          assessments={assessments}
        />
      </TabsContent>
      
      <TabsContent value="habits" className="space-y-6">
        <HabitTabContent topDevelopmentArea={topDevelopmentArea} />
      </TabsContent>
    </>
  );
};

export default ResultsTabContent;
