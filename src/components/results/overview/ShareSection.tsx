
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButton from '../sharing/ShareButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareSectionProps {
  assessment: HEARTIAssessment;
}

const ShareSection: React.FC<ShareSectionProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center gap-2 flex-wrap">
          <span className="text-base sm:text-lg">HEARTI:Leader Quotient Results</span>
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
          Share your HEARTI:Leader results with others or save them for future reference.
        </p>
      </CardContent>
    </Card>
  );
};

export default ShareSection;
