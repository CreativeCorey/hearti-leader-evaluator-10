
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ScoreCardProps {
  assessment: HEARTIAssessment;
  formattedDate: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ assessment, formattedDate }) => {
  const { t } = useLanguage();
  
  // Compute proper translations with fallbacks
  const lqTitle = t('results.lq.title', { fallback: "Your HEARTI:Leader Quotient" });
  const completedText = t('assessment.completed', { fallback: "Assessment completed on" });
  const overallScoreText = t('results.summary.overallScore', { fallback: "Overall Score" });
  const overallDescriptionText = t('results.summary.overallDescription', { 
    fallback: "Your HEARTI:Leader Quotient indicates your overall proficiency in the skills needed for 21st century leadership." 
  });
  const topStrengthText = t('results.summary.topStrength', { fallback: "Top Strength" });
  const strengthDescriptionText = t('results.summary.strengthDescription', { 
    fallback: "This is your highest-scoring HEARTI dimension." 
  });
  const developmentAreaText = t('results.summary.developmentArea', { fallback: "Development Area" });
  const developmentDescriptionText = t('results.summary.developmentDescription', { 
    fallback: "This dimension has the most potential for growth." 
  });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{lqTitle}</CardTitle>
        <CardDescription>{completedText} {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="text-muted-foreground">{overallScoreText}</p>
            <div className="flex items-center justify-center">
              {/* Proper oval background for the score */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-12 bg-orange-100 rounded-full"></div>
                <span className="text-4xl font-bold relative z-10">{assessment.overallScore}</span>
                <span className="text-muted-foreground ml-1 relative z-10">/5</span>
              </div>
            </div>
            <p className="text-sm text-center max-w-[220px]">
              {overallDescriptionText}
            </p>
          </div>
          
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="text-muted-foreground">{topStrengthText}</p>
            <div className="flex items-center gap-2 justify-center">
              {Object.entries(assessment.dimensionScores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 1)
                .map(([dimension, score]) => (
                  <div key={dimension} className="space-y-1 flex flex-col items-center">
                    <p className="font-medium capitalize">{dimension}</p>
                    <Badge variant="default" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                  </div>
                ))}
            </div>
            <p className="text-sm text-center max-w-[220px]">
              {strengthDescriptionText}
            </p>
          </div>
          
          <div className="space-y-2 text-center flex flex-col items-center">
            <p className="text-muted-foreground">{developmentAreaText}</p>
            <div className="flex items-center gap-2 justify-center">
              {Object.entries(assessment.dimensionScores)
                .sort(([, a], [, b]) => a - b)
                .slice(0, 1)
                .map(([dimension, score]) => (
                  <div key={dimension} className="space-y-1 flex flex-col items-center">
                    <p className="font-medium capitalize">{dimension}</p>
                    <Badge variant="outline" className={`dimension-${dimension.toLowerCase()}`}>{score}/5</Badge>
                  </div>
                ))}
            </div>
            <p className="text-sm text-center max-w-[220px]">
              {developmentDescriptionText}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
