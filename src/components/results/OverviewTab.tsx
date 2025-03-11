
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShareResultsCard from './sharing/ShareResultsCard';
import DemographicsSection from './DemographicsSection';
import DimensionChart from './development/DimensionChart';
import ShareButton from './sharing/ShareButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface OverviewTabProps {
  assessment: HEARTIAssessment;
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  assessment, 
  onSelectAssessment 
}) => {
  const isMobile = useIsMobile();
  
  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Sample dimension scores from the assessment
  const dimensionScores = assessment.dimensionScores;

  return (
    <div className="space-y-6">
      {/* HEARTI Spectra Chart - Fixed height and overflow handling */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>HEARTI Spectra</CardTitle>
              <CardDescription>Your leadership dimension scores</CardDescription>
            </div>
            <ShareButton 
              assessment={assessment} 
              variant="outline"
              size={isMobile ? "sm" : "default"}
            />
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-0 pb-8">
          <div className="h-[320px] w-full mx-auto max-w-[450px]">
            <DimensionChart 
              dimensionScores={dimensionScores}
              activeDimension="humility"
              showAllDimensions={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* HEARTI:Leader Score Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Your HEARTI:Leader Quotient</CardTitle>
          <CardDescription>Assessment completed on {formatDate(assessment.date)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">Overall Score</p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{assessment.overallScore}</span>
                <span className="text-muted-foreground ml-1">/5</span>
              </div>
              <p className="text-sm">Your HEARTI:Leader Quotient indicates your overall proficiency in the skills needed for 21st century leadership.</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">Top Strength</p>
              <div className="flex items-center gap-2">
                {Object.entries(assessment.dimensionScores)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 1)
                  .map(([dimension, score]) => (
                    <div key={dimension} className="space-y-1">
                      <p className="font-medium capitalize">{dimension}</p>
                      <Badge variant="default" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                    </div>
                  ))}
              </div>
              <p className="text-sm">This is your highest-scoring HEARTI dimension.</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-muted-foreground">Development Area</p>
              <div className="flex items-center gap-2">
                {Object.entries(assessment.dimensionScores)
                  .sort(([, a], [, b]) => a - b)
                  .slice(0, 1)
                  .map(([dimension, score]) => (
                    <div key={dimension} className="space-y-1">
                      <p className="font-medium capitalize">{dimension}</p>
                      <Badge variant="outline" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                    </div>
                  ))}
              </div>
              <p className="text-sm">This dimension has the most potential for growth.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShareResultsCard assessment={assessment} />
        <DemographicsSection demographics={assessment.demographics} />
      </div>
    </div>
  );
};

export default OverviewTab;
