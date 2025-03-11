
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { formatDate } from './utils/dateFormatters';
import { 
  ShareSection,
  SpectraSection,
  ScoreCard,
  ProgressChart
} from './overview';

interface OverviewTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[]; 
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  assessment, 
  assessments = [], 
  onSelectAssessment 
}) => {
  // Format date string for display
  const formattedDate = formatDate(assessment.date);
  
  return (
    <div className="space-y-6">
      {/* Share Results Card at the top */}
      <ShareSection assessment={assessment} />
      
      {/* HEARTI Spectra Chart */}
      <SpectraSection assessment={assessment} />
      
      {/* HEARTI:Leader Score Card */}
      <ScoreCard assessment={assessment} formattedDate={formattedDate} />
      
      {/* Assessment Progress Chart */}
      <ProgressChart assessment={assessment} assessments={assessments} />
    </div>
  );
};

export default OverviewTab;
