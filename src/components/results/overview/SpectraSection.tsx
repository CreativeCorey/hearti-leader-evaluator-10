
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';
import { dimensionColors } from '../development/DimensionIcons';

interface SpectraSectionProps {
  assessment: HEARTIAssessment;
}

const SpectraSection: React.FC<SpectraSectionProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Format data for the radial bar chart
  const chartData = Object.entries(assessment.dimensionScores).map(([dimension, score]) => ({
    name: t(`dimensions.${dimension}`),
    value: score * 20, // Convert 0-5 scale to 0-100 scale for better visualization
    fill: dimensionColors[dimension as keyof typeof dimensionColors],
    dimension: dimension
  })).sort((a, b) => b.value - a.value); // Sort by value descending for better layering
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl md:text-2xl">{t('results.spectra.title')}</CardTitle>
          <CardDescription className="text-sm">{t('results.spectra.subtitle')}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-0 pb-6 text-left">
        <div className="h-[250px] sm:h-[280px] w-full mx-auto max-w-[380px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="20%" 
              outerRadius="80%" 
              barSize={20} 
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={8}
                label={{ 
                  position: 'insideStart', 
                  fill: '#fff', 
                  fontWeight: 'bold',
                  fontSize: 12
                }}
              />
              <Legend 
                iconSize={10} 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                wrapperStyle={{
                  fontSize: isMobile ? '10px' : '12px',
                  paddingLeft: '10px'
                }}
                formatter={(value, entry) => {
                  const { payload } = entry as any;
                  return t(`dimensions.${payload.dimension}`);
                }}
              />
              <Tooltip
                formatter={(value) => [`${(value as number / 20).toFixed(1)}/5`, 'Score']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '6px', 
                  border: 'none', 
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                  padding: '8px 12px'
                }}
                labelFormatter={(label) => {
                  const item = chartData.find(item => item.name === label);
                  return item ? t(`dimensions.${item.dimension}`) : label;
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpectraSection;
