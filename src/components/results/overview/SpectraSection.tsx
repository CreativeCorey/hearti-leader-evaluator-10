
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DimensionChart from '../development/DimensionChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface SpectraSectionProps {
  assessment: HEARTIAssessment;
}

const SpectraSection: React.FC<SpectraSectionProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl md:text-2xl">{t('results.spectra.title')}</CardTitle>
          <CardDescription className="text-sm">{t('results.spectra.subtitle')}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-0 pb-6">
        <div className="h-[250px] sm:h-[280px] w-full mx-auto max-w-[380px]">
          <DimensionChart 
            dimensionScores={assessment.dimensionScores}
            activeDimension="humility"
            showAllDimensions={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpectraSection;
