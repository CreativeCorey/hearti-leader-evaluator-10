
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart, getFeedback } from '@/utils/calculations';
import { Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';
import { dimensionColors } from '../development/DimensionIcons';

interface ShareResultsCardProps {
  assessment: HEARTIAssessment;
  showDetails?: boolean;
}

const ShareResultsCard: React.FC<ShareResultsCardProps> = ({ assessment, showDetails = true }) => {
  const isMobile = useIsMobile();
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const topStrengthScore = assessment.dimensionScores[topStrength];
  const userColor = "#6366f1";
  
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

  return (
    <Card className="w-full shadow-lg overflow-hidden bg-white">
      <CardContent className="p-4">
        {/* Logo and Header */}
        <div className="text-center mb-2">
          <div className="flex justify-center items-center mb-1">
            <h3 className="text-xl font-bold text-gray-800">HEARTI:Leader Spectra</h3>
          </div>
          <p className="text-sm text-gray-600">Overall Score: {assessment.overallScore}/5</p>
        </div>
        
        <div className="h-[250px] w-full relative">
          {/* Icon overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top (Humility) - Adjusted position */}
            <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2">
              <Gauge size={iconSize} style={{ color: dimensionColors.humility }} />
            </div>
            
            {/* Top Right (Empathy) */}
            <div className="absolute top-[25%] right-[15%] transform">
              <HeartHandshake size={iconSize} style={{ color: dimensionColors.empathy }} />
            </div>
            
            {/* Bottom Right (Accountability) */}
            <div className="absolute bottom-[25%] right-[15%] transform">
              <ChartNoAxesCombined size={iconSize} style={{ color: dimensionColors.accountability }} />
            </div>
            
            {/* Bottom (Resiliency) - Adjusted position */}
            <div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2">
              <TreePalm size={iconSize} style={{ color: dimensionColors.resiliency }} />
            </div>
            
            {/* Bottom Left (Transparency) */}
            <div className="absolute bottom-[25%] left-[15%] transform">
              <Blend size={iconSize} style={{ color: dimensionColors.transparency }} />
            </div>
            
            {/* Top Left (Inclusivity) */}
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
                stroke={userColor}
                fill={userColor}
                fillOpacity={0.6}
                dot={{ r: 5 }}
                isAnimationActive={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {showDetails && (
          <>
            <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100">
              <p className="font-medium flex items-center text-green-800">
                <Crown size={16} className="mr-2" />
                Top Strength: {topStrength.charAt(0).toUpperCase() + topStrength.slice(1)} ({topStrengthScore}/5)
                {getDimensionIcon(topStrength)}
              </p>
              <p className="text-green-700 mt-1 text-sm">
                {getFeedback(topStrengthScore, topStrength)}
              </p>
            </div>
            
            {/* App URL */}
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
