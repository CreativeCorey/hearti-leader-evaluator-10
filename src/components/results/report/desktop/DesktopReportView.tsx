
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ReportHeader from '../ReportHeader';
import SpectraCharts from '../SpectraCharts';
import DimensionCard from '../DimensionCard';
import ReportFooter from '../ReportFooter';

interface DesktopReportViewProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
}

const DesktopReportView: React.FC<DesktopReportViewProps> = ({ assessment, assessments = [] }) => {
  return (
    <div className="pdf-page">
      <ReportHeader assessment={assessment} />
      
      <SpectraCharts assessment={assessment} assessments={assessments} />
      
      <div className="pdf-section">
        <h3 className="text-2xl font-medium mb-4 pdf-section-title">HEARTI Dimension Analysis</h3>
        <p className="text-sm mb-4">
          Each dimension below shows your score, competency level, and guidance for your continued development.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(assessment.dimensionScores).map(([dimension, score]) => (
            <DimensionCard 
              key={dimension} 
              dimension={dimension as 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity'}
              score={score}
            />
          ))}
        </div>
      </div>
      
      <ReportFooter />
    </div>
  );
};

export default DesktopReportView;
