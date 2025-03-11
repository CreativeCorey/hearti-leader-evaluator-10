
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
        <CardTitle className="flex justify-between items-center gap-2 flex-wrap">
          <span className="text-base sm:text-lg">{t('results.lq.title')}</span>
          <div className="flex-shrink-0">
            <ShareButton 
              assessment={assessment} 
              variant="default"
              size={isMobile ? "sm" : "default"}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t('results.lq.subtitle')}
        </p>
      </CardContent>
    </Card>
  );
};

export default ShareSection;
