
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';
import { DimensionIcons } from '../comparison/radar';

interface SpectraSectionProps {
  assessment: HEARTIAssessment;
}

const SpectraSection: React.FC<SpectraSectionProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Format data for the radar chart
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl md:text-2xl">{t('results.spectra.title')}</CardTitle>
          <CardDescription className="text-sm">{t('results.spectra.subtitle')}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-0 pb-6">
        <div className="h-[250px] sm:h-[280px] w-full mx-auto max-w-[380px] relative">
          <DimensionIcons iconSize={isMobile ? 24 : 24} />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              outerRadius={isMobile ? "58%" : "65%"} 
              data={chartData}
            >
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={false} 
                axisLineType="polygon"
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 5]} 
                tick={{ fontSize: 10 }} 
                tickCount={6}
              />
              <Radar
                name="Your HEARTI"
                dataKey="value"
                stroke="#D946EF"
                fill="#D946EF"
                fillOpacity={0.6}
                dot={{ r: 4, strokeWidth: 1, stroke: "white" }}
                isAnimationActive={true}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpectraSection;
