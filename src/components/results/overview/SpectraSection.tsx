
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DimensionChart from '../development/DimensionChart';
import ShareButton from '../sharing/ShareButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface SpectraSectionProps {
  assessment: HEARTIAssessment;
}

const SpectraSection: React.FC<SpectraSectionProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl md:text-2xl">HEARTI Spectra</CardTitle>
            <CardDescription className="text-sm">Your leadership dimension scores</CardDescription>
          </div>
          <ShareButton 
            assessment={assessment} 
            variant="outline"
            size={isMobile ? "sm" : "default"}
          />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-0 pb-8">
        <div className="h-[320px] w-full mx-auto max-w-[450px]">
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
