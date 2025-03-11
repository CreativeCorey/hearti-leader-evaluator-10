
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButton from '../sharing/ShareButton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ShareSectionProps {
  assessment: HEARTIAssessment;
}

const ShareSection: React.FC<ShareSectionProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className={`${isMobile ? 'text-center text-xl mb-2' : 'flex justify-between items-center gap-2 flex-wrap text-base sm:text-lg'}`}>
          {t('results.lq.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? 'flex flex-col items-center' : ''}>
        <p className={`text-sm text-muted-foreground ${isMobile ? 'text-center mb-4' : ''}`}>
          {t('results.lq.subtitle')}
        </p>
        {isMobile && (
          <ShareButton 
            assessment={assessment} 
            variant="default"
            size="default"
            className="mt-2"
          />
        )}
        {!isMobile && (
          <div className="flex justify-end mt-2">
            <ShareButton 
              assessment={assessment} 
              variant="default"
              size={isMobile ? "sm" : "default"}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShareSection;
