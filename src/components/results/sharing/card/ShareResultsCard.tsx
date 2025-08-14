
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { dimensionColors } from '@/components/results/development/DimensionIcons';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language/LanguageContext';
import RadarChartWithIcons from './RadarChartWithIcons';
import TopStrengthBadge from './TopStrengthBadge';

interface ShareResultsCardProps {
  assessment: HEARTIAssessment;
  showDetails?: boolean;
  onShare?: () => void;
}

const ShareResultsCard: React.FC<ShareResultsCardProps> = ({ 
  assessment, 
  showDetails = true, 
  onShare 
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Find the top strength dimension
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const topStrengthScore = assessment.dimensionScores[topStrength];
  
  // Use the top strength dimension color for the radar chart
  const chartColor = dimensionColors[topStrength];

  return (
    <Card className="w-full shadow-lg overflow-hidden bg-white">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <div className="flex justify-center items-center mb-2">
            <img 
              src="/lovable-uploads/4d98c01d-a453-45c9-913f-72d63347fd2a.png" 
              alt="HEARTI Leader" 
              className="h-8"
            />
          </div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {isMobile ? "My Spectra" : "My HEARTI:Leader Spectra"}
            </h3>
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 size={15} className="mr-1" />
                {t('common.share')}
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">{assessment.overallScore}/5</p>
        </div>
        
        <RadarChartWithIcons 
          assessment={assessment} 
          topStrength={topStrength} 
          chartColor={chartColor} 
        />
        
        {showDetails && (
          <>
            <TopStrengthBadge 
              topStrength={topStrength} 
              topStrengthScore={topStrengthScore} 
            />
            
            <div className="mt-3 text-center border-t border-gray-200 pt-2">
              <p className="text-indigo-600 font-medium">hearti.app</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShareResultsCard;
