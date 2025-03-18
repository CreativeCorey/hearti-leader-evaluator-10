
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
  const { t, currentLanguage } = useLanguage();
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
        
        // Get dimension description with fallback
        const dimensionDescription = t(`dimensions.descriptions.${dimension}`, {
          fallback: getDimensionDescription(dimension)
        });
        
        // Create the feedback key and provide dimension-specific fallbacks
        const feedbackKey = `dimensions.feedback.${dimension}.${feedbackLevel}`;
        
        // Generate fallback text based on dimension and level
        const fallbackText = generateFeedbackFallback(dimension, feedbackLevel);
        
        // Get the specific feedback with appropriate fallback
        const feedbackText = t(feedbackKey, { fallback: fallbackText });
        
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
              <p className="text-muted-foreground text-sm mb-2">{dimensionDescription}</p>
              <p className="text-sm">{feedbackText}</p>
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

// Helper to generate fallback feedback text
function generateFeedbackFallback(dimension: string, level: string): string {
  const baseFeedback = {
    excellent: `You excel in ${dimension}. Your high score demonstrates exceptional competence in this area.`,
    good: `You have a good level of ${dimension}. Continue strengthening this dimension for leadership success.`,
    average: `You have a moderate level of ${dimension}. There's room to grow in this dimension.`,
    needsImprovement: `You should focus on developing ${dimension}. This is an opportunity area for your leadership growth.`
  };
  
  return baseFeedback[level];
}

// Helper to provide dimension descriptions
function getDimensionDescription(dimension: string): string {
  const descriptions = {
    humility: "The ability to recognize one's limitations and mistakes, and to be open to feedback and growth.",
    empathy: "The capacity to understand and share the feelings of others, and to respond with compassion.",
    accountability: "The willingness to take responsibility for one's actions and decisions, and to follow through on commitments.",
    resiliency: "The ability to recover from setbacks, adapt to change, and keep going in the face of adversity.",
    transparency: "The practice of being open, honest, and clear in communications and decision-making processes.",
    inclusivity: "The commitment to creating environments where all people feel welcomed, respected, and valued."
  };
  
  return descriptions[dimension] || `Description for ${dimension}`;
}

export default DimensionsTab;
