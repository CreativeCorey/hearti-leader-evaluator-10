
import React, { useState } from 'react';
import { HEARTIDimension } from '@/types';
import DimensionChartViewSelector from './DimensionChartViewSelector';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ChartSectionProps {
  activeDimension: HEARTIDimension;
  dimensionScores: Record<HEARTIDimension, number>;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  activeDimension,
  dimensionScores
}) => {
  const [chartView, setChartView] = useState<'focused' | 'all'>('focused');
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  return (
    <div className="mt-6 space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between items-center'}`}>
        <h3 className={`text-xl font-semibold ${isMobile ? 'mb-2' : ''}`}>
          {t('results.dimensions.score')}
        </h3>
      </div>
      
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="text-center">
            <p className="text-2xl font-bold">{dimensionScores[activeDimension].toFixed(1)}<span className="text-muted-foreground text-lg">/5</span></p>
            <p className="text-muted-foreground mt-2">
              {activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1)} Score
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
