
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShareResultsCard from './sharing/ShareResultsCard';
import DemographicsSection from './DemographicsSection';
import HistoricalResults from '../HistoricalResults';
import DimensionChart from './development/DimensionChart';

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
      {/* HEARTI Spectra Chart - Fixed height and padding to prevent overflow */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>HEARTI Spectra</CardTitle>
          <CardDescription>Your leadership dimension scores</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-6">
          {/* Increased height and ensured proper padding to prevent overflow */}
          <div className="h-[360px] px-4 -mx-2">
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

      {assessments.length > 1 && (
        <HistoricalResults assessments={assessments} onSelect={onSelectAssessment} />
      )}
    </div>
  );
};

export default OverviewTab;
