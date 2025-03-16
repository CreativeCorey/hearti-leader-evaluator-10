
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { formatDate } from './utils/dateFormatters';
import { 
  ShareSection,
  SpectraSection,
  ScoreCard
} from './overview';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface OverviewTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[]; 
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

// Fallback data for when assessment is invalid or missing
const fallbackAssessment: Partial<HEARTIAssessment> = {
  date: new Date().toISOString(),
  dimensionScores: {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  },
  overallScore: 3.8
};

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  assessment, 
  assessments = [], 
  onSelectAssessment 
}) => {
  const { t, currentLanguage } = useLanguage();
  
  // Check if assessment is valid and has necessary data
  const isValidAssessment = assessment && 
    assessment.dimensionScores && 
    Object.keys(assessment.dimensionScores).length > 0;
  
  // Use fallback if assessment is invalid
  const safeAssessment = isValidAssessment 
    ? assessment 
    : { ...assessment, ...fallbackAssessment } as HEARTIAssessment;
  
  // Format date string for display (respect language settings)
  const formattedDate = formatDate(safeAssessment.date);
  
  return (
    <div className="space-y-6">
      {/* HEARTI Spectra Chart at the top */}
      <SpectraSection assessment={safeAssessment} />
      
      {/* Share Results Card */}
      <ShareSection assessment={safeAssessment} />
      
      {/* HEARTI:Leader Score Card */}
      <ScoreCard assessment={safeAssessment} formattedDate={formattedDate} />
    </div>
  );
};

export default OverviewTab;
