
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dimensionIcons, dimensionColors } from './development/DimensionIcons';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DimensionsTabProps {
  assessment: HEARTIAssessment;
}

const DimensionsTab: React.FC<DimensionsTabProps> = ({ assessment }) => {
  const { t } = useLanguage();
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);

  const getBadgeVariant = (score: number) => {
    if (score >= 4.5) return "default";
    if (score >= 3.5) return "secondary";
    if (score >= 2.5) return "outline";
    return "destructive";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedDimensions.map((dimension) => {
        const DimensionIcon = dimensionIcons[dimension];
        const score = assessment.dimensionScores[dimension];
        const feedbackLevel = getFeedbackLevel(score);
        
        return (
          <Card key={dimension} className="shadow-sm overflow-hidden border-t-4" style={{ borderTopColor: dimensionColors[dimension] }}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <DimensionIcon size={22} style={{ color: dimensionColors[dimension] }} />
                {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
              </CardTitle>
              <Badge variant={getBadgeVariant(score)} className="ml-2">
                {score.toFixed(1)}/5
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-2">{t(`dimensions.descriptions.${dimension}`)}</p>
              <p className="text-sm">{t(`dimensions.feedback.${dimension}.${feedbackLevel}`)}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Helper function to get the feedback level based on score
function getFeedbackLevel(score: number): string {
  if (score >= 4.5) return "excellent";
  if (score >= 3.5) return "good";
  if (score >= 2.5) return "average";
  return "needsImprovement";
}

export default DimensionsTab;
