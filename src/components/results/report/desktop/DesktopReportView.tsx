
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Separator } from '@/components/ui/separator';
import { ReportHeader, SpectraCharts, DimensionCard, ReportFooter } from '../index';

interface DesktopReportViewProps {
  assessment: HEARTIAssessment;
}

const DesktopReportView: React.FC<DesktopReportViewProps> = ({ assessment }) => {
  return (
    <>
      <ReportHeader assessment={assessment} />
      <SpectraCharts assessment={assessment as any} />
      <Separator className="my-8" />
      <div className="pdf-section mb-8">
        <h3 className="text-2xl font-medium mb-6 pdf-section-title">HEARTI:Leader Dimensions in Detail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pdf-dimension-cards">
          {Object.entries(assessment.dimensionScores).map(([dimension, score]) => (
            <DimensionCard 
              key={dimension} 
              dimension={dimension as any}
              score={score as any} 
            />
          ))}
        </div>
      </div>
      <ReportFooter />
    </>
  );
};

export default DesktopReportView;
