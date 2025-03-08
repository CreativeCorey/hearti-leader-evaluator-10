
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import OverviewTab from './OverviewTab';
import DimensionsTab from './DimensionsTab';
import ComparisonTab from './ComparisonTab';
import ReportTab from './ReportTab';
import DevelopmentTab from './DevelopmentTab';
import HabitTab from './HabitTab';

interface ResultsTabContentProps {
  assessment: HEARTIAssessment;
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
  topDevelopmentArea: HEARTIDimension;
  topStrength: HEARTIDimension;
}

const ResultsTabContent: React.FC<ResultsTabContentProps> = ({ 
  assessment, 
  reportRef, 
  onExportPDF, 
  exportingPdf,
  topDevelopmentArea,
  topStrength
}) => {
  return (
    <>
      <TabsContent value="overview" className="space-y-6">
        <OverviewTab assessment={assessment} />
      </TabsContent>
      
      <TabsContent value="dimensions" className="space-y-6">
        <DimensionsTab assessment={assessment} />
      </TabsContent>
      
      <TabsContent value="comparison" className="space-y-6">
        <ComparisonTab assessment={assessment} />
      </TabsContent>
      
      <TabsContent value="report" className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">HEARTI:Leader Quotient Report</h3>
            <p className="text-sm text-muted-foreground">Measuring Leadership Competencies Designed for the New World of Work</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onExportPDF}
            disabled={exportingPdf}
          >
            {exportingPdf ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Export PDF
          </Button>
        </div>
        
        <div ref={reportRef} className="space-y-6 p-4">
          <ReportTab assessment={assessment} />
        </div>
      </TabsContent>
      
      <TabsContent value="development" className="space-y-6">
        <DevelopmentTab focusDimension={topDevelopmentArea} topStrength={topStrength} />
      </TabsContent>
      
      <TabsContent value="habits" className="space-y-6">
        <HabitTab focusDimension={topDevelopmentArea} />
      </TabsContent>
    </>
  );
};

export default ResultsTabContent;
