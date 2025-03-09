
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';
import { ReportHeader, ReportFooter, DimensionCard } from './report';
import SpectraCharts from './report/SpectraCharts';
import ShareButton from './sharing/ShareButton';
import LinkedInBadge from './sharing/LinkedInBadge';

interface ReportTabProps {
  assessment: HEARTIAssessment;
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
}

const ReportTab: React.FC<ReportTabProps> = ({ 
  assessment,
  reportRef, 
  onExportPDF,
  exportingPdf
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h2 className="text-2xl font-semibold">HEARTI:Leader Report</h2>
        <div className="flex gap-2">
          <LinkedInBadge assessment={assessment} />
          <ShareButton assessment={assessment} />
          <Button 
            onClick={onExportPDF} 
            disabled={exportingPdf}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            {exportingPdf ? "Generating PDF..." : "Export PDF"}
          </Button>
        </div>
      </div>
      
      <Card className="p-6">
        <div className="pdf-container" ref={reportRef}>
          <ReportHeader assessment={assessment} />
          
          <SpectraCharts assessment={assessment} />
          
          <Separator className="my-8" />
          
          <div className="pdf-section mb-8">
            <h3 className="text-2xl font-medium mb-6 pdf-section-title">HEARTI:Leader Dimensions in Detail</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pdf-dimension-cards">
              {Object.entries(assessment.dimensionScores).map(([dimension, score]) => (
                <DimensionCard 
                  key={dimension} 
                  dimension={dimension as any}
                  score={score} 
                />
              ))}
            </div>
          </div>
          
          <ReportFooter />
        </div>
      </Card>
    </div>
  );
};

export default ReportTab;
