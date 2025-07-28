
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { formatDate } from './utils/dateFormatters';
import { 
  ShareSection,
  SpectraSection,
  ScoreCard
} from './overview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface OverviewTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[]; 
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
  hasPaid?: boolean;
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
  onSelectAssessment,
  hasPaid = true 
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
      {/* Always show HEARTI Leader Score */}
      <ScoreCard assessment={safeAssessment} formattedDate={formattedDate} />
      
      {hasPaid ? (
        <>
          {/* Full content for paying users */}
          <SpectraSection assessment={safeAssessment} />
          <ShareSection assessment={safeAssessment} />
        </>
      ) : (
        /* Limited content for non-paying users */
        <>
          <Card className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-gray-950/95 z-10 flex items-end justify-center pb-6">
              <div className="text-center">
                <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-medium">Unlock to see detailed HEARTI™ dimensions</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>HEARTI™ Spectra Analysis</CardTitle>
              <CardDescription>Your detailed leadership profile across all six dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="opacity-20 pointer-events-none">
                <SpectraSection assessment={safeAssessment} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/95 dark:to-gray-950/95 z-10 flex items-end justify-center pb-6">
              <div className="text-center">
                <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-medium">Unlock to share your results</p>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Share Your Results</CardTitle>
              <CardDescription>Show your leadership growth to your network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded opacity-20"></div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default OverviewTab;
