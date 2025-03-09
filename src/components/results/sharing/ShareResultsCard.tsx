
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart, getFeedback } from '@/utils/calculations';
import { Crown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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

  return (
    <Card className="w-full shadow-lg overflow-hidden bg-white">
      <CardContent className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">HEARTI:Leader Spectra</h3>
          <p className="text-sm text-gray-600">Overall Score: {assessment.overallScore}/5</p>
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={isMobile ? "60%" : "70%"} data={chartData}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={isMobile ? false : { 
                  fill: '#6b7280', 
                  fontSize: 12 
                }} 
                axisLineType="polygon"
                tickLine={false}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 5]} 
                tick={{ 
                  fill: isMobile ? '#C8C8C9' : '#6b7280',
                  fontSize: isMobile ? 8 : 10 
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
          <div className="mt-4 bg-green-50 p-3 rounded-md border border-green-100">
            <p className="font-medium flex items-center text-green-800">
              <Crown size={16} className="mr-2" />
              Top Strength: {topStrength.charAt(0).toUpperCase() + topStrength.slice(1)} ({topStrengthScore}/5)
            </p>
            <p className="text-green-700 mt-1 text-sm">
              {getFeedback(topStrengthScore, topStrength)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShareResultsCard;
