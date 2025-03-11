
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';
import { Share2, Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { dimensionColors } from '../development/DimensionIcons';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ShareResultsCardProps {
  assessment: HEARTIAssessment;
  showDetails?: boolean;
  onShare?: () => void;
}

const ShareResultsCard: React.FC<ShareResultsCardProps> = ({ assessment, showDetails = true, onShare }) => {
  const isMobile = useIsMobile();
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const { t } = useLanguage();
  
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const topStrengthScore = assessment.dimensionScores[topStrength];
  
  // Use the top strength dimension color for the radar chart
  const chartColor = dimensionColors[topStrength];
  
  const iconSize = isMobile ? 20 : 18;
  
  const getDimensionIcon = (dimension: HEARTIDimension) => {
    switch(dimension) {
      case 'humility': return <Gauge size={24} style={{ color: dimensionColors.humility }} />;
      case 'empathy': return <HeartHandshake size={24} style={{ color: dimensionColors.empathy }} />;
      case 'accountability': return <ChartNoAxesCombined size={24} style={{ color: dimensionColors.accountability }} />;
      case 'resiliency': return <TreePalm size={24} style={{ color: dimensionColors.resiliency }} />;
      case 'transparency': return <Blend size={24} style={{ color: dimensionColors.transparency }} />;
      case 'inclusivity': return <Users size={24} style={{ color: dimensionColors.inclusivity }} />;
      default: return null;
    }
  };

  // Get the initial letter of the top dimension
  const topDimensionInitial = topStrength.charAt(0).toUpperCase();
  
  // Get translated dimension name
  const getTranslatedDimensionName = (dimension: HEARTIDimension) => {
    return t(`results.dimensions.${dimension}`);
  };

  return (
    <Card className="w-full shadow-lg overflow-hidden bg-white">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <div className="flex justify-center items-center mb-2">
            <img 
              src="/lovable-uploads/4d98c01d-a453-45c9-913f-72d63347fd2a.png" 
              alt="HEARTI Leader" 
              className="h-8"
            />
          </div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">
              {isMobile ? "My Spectra" : "My HEARTI:Leader Spectra"}
            </h3>
            {onShare && (
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 size={15} className="mr-1" />
                {t('common.share')}
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">{assessment.overallScore}/5</p>
        </div>
        
        <div className="h-[250px] w-full relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2">
              <Gauge size={iconSize} style={{ color: dimensionColors.humility }} />
            </div>
            
            <div className="absolute top-[25%] right-[15%] transform">
              <HeartHandshake size={iconSize} style={{ color: dimensionColors.empathy }} />
            </div>
            
            <div className="absolute bottom-[25%] right-[15%] transform">
              <ChartNoAxesCombined size={iconSize} style={{ color: dimensionColors.accountability }} />
            </div>
            
            <div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2">
              <TreePalm size={iconSize} style={{ color: dimensionColors.resiliency }} />
            </div>
            
            <div className="absolute bottom-[25%] left-[15%] transform">
              <Blend size={iconSize} style={{ color: dimensionColors.transparency }} />
            </div>
            
            <div className="absolute top-[25%] left-[15%] transform">
              <Users size={iconSize} style={{ color: dimensionColors.inclusivity }} />
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={isMobile ? "60%" : "70%"} data={chartData}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={false} 
                axisLineType="polygon"
                tickLine={false}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 5]} 
                tick={{ 
                  fill: '#C8C8C9',
                  fontSize: isMobile ? 7 : 9,
                  opacity: 0.7
                }} 
              />
              <Radar
                name="Your HEARTI Spectra"
                dataKey="value"
                stroke={chartColor}
                fill={chartColor}
                fillOpacity={0.6}
                dot={{ r: 5 }}
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
          
          {/* Fixed centered hexagon with initial */}
          <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 48 48" 
              preserveAspectRatio="xMidYMid meet"
              className="absolute"
            >
              <polygon 
                points="24,4 44,14 44,34 24,44 4,34 4,14"
                fill="white" 
                stroke={dimensionColors[topStrength]} 
                strokeWidth="2"
              />
            </svg>
            {/* Centered initial inside hexagon */}
            <span 
              className="relative z-20 text-2xl font-bold"
              style={{ color: dimensionColors[topStrength] }}
            >
              {topDimensionInitial}
            </span>
          </div>
        </div>
        
        {showDetails && (
          <>
            <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Crown size={16} className="mr-2" />
                  <span className="font-semibold mr-1">Top Skill:</span>
                </div>
                <div>
                  {getDimensionIcon(topStrength)}
                </div>
              </div>
              <div className="mt-1">
                <p className="font-medium text-green-800">
                  {getTranslatedDimensionName(topStrength)}
                </p>
                <p className="text-green-700 font-semibold">
                  {topStrengthScore}/5
                </p>
              </div>
            </div>
            
            <div className="mt-3 text-center border-t pt-2">
              <p className="text-indigo-600 font-medium">takehearti.com</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShareResultsCard;
