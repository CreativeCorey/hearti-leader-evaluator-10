import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDimensionReportContent } from '@/utils/calculations';
import { dimensionIcons } from '../development/DimensionIcons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DimensionCardProps {
  dimension: HEARTIDimension;
  score: number;
  status?: 'strength' | 'vulnerability' | 'neutral';
  userName?: string;
  assessment?: HEARTIAssessment;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ 
  dimension, 
  score, 
  status = 'neutral', 
  userName = '', 
  assessment 
}) => {
  const { statusContent, description, levels, tips } = getDimensionReportContent(dimension, status, userName);
  const DimensionIcon = dimensionIcons[dimension];
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // PDF class mapping for dimension headers
  const dimensionHeaderClass = `${dimension.toLowerCase()}-header`;
  
  // Determine background color based on status
  const bgColorClass = 
    status === 'strength' ? 'bg-green-600' : 
    status === 'vulnerability' ? 'bg-amber-600' : 
    'bg-blue-600';

  // Translate status text but keep dimension name untranslated
  const getStatusText = () => {
    if (status === 'strength') return `(${t('results.comparison.strength')})`;
    if (status === 'vulnerability') return `(${t('results.comparison.vulnerability')})`;
    return `(${t('results.comparison.competent')})`;
  };

  return (
    <Card className={`mb-8 overflow-hidden pdf-dimension-card ${isMobile ? 'h-full' : ''}`}>
      <div className={`py-4 px-5 text-white pdf-dimension-header ${bgColorClass} ${dimensionHeaderClass}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold uppercase pdf-dimension-title flex items-center gap-2">
            <DimensionIcon size={24} className="text-white" />
            {dimension}
          </h3>
          <Badge className="text-sm py-1 px-3 bg-white text-gray-800 pdf-dimension-score">
            {t('results.dimensions.scoreLabel')}: {score}/5
          </Badge>
        </div>
        <span className="text-sm text-white/90 mt-1 inline-block">
          {getStatusText()}
        </span>
      </div>
      
      <CardContent className={`p-6 pdf-dimension-content ${isMobile ? 'overflow-y-auto max-h-[calc(70vh-100px)]' : ''}`}>
        <div className="prose max-w-none">
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: statusContent }} />
          
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: description }} />
          
          {isMobile ? (
            // For mobile view, collapse sections into an accordion-like structure
            <>
              {levels && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium uppercase mb-2 flex items-center gap-2">
                    <DimensionIcon size={18} className="text-gray-500" />
                    {t('results.dimensions.levelsOf')} {dimension}
                  </h4>
                  <div dangerouslySetInnerHTML={{ __html: levels }} />
                </div>
              )}
              
              {tips && (
                <div>
                  <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <DimensionIcon size={18} className="text-gray-500" />
                    {t('results.dimensions.developmentTips')}
                  </h4>
                  <div dangerouslySetInnerHTML={{ __html: tips }} />
                </div>
              )}
            </>
          ) : (
            // For desktop, keep the original layout
            <>
              {levels && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium uppercase mb-2 flex items-center gap-2">
                    <DimensionIcon size={18} className="text-gray-500" />
                    {t('results.dimensions.levelsOf')} {dimension}
                  </h4>
                  <div dangerouslySetInnerHTML={{ __html: levels }} />
                </div>
              )}
              
              {tips && (
                <div>
                  <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <DimensionIcon size={18} className="text-gray-500" />
                    {t('results.dimensions.tipsForIncreasing')} {dimension} {t('results.dimensions.leadership')}
                  </h4>
                  <div dangerouslySetInnerHTML={{ __html: tips }} />
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionCard;
