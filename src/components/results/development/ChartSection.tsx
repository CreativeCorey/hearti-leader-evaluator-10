
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ChartSectionProps {
  activeDimension: HEARTIDimension;
  dimensionScores: Record<HEARTIDimension, number>;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  activeDimension,
  dimensionScores
}) => {
  return (
    <div className="mt-6 space-y-4">
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
