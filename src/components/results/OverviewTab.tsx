
import React from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatDataForRadarChart, getFeedback } from '@/utils/calculations';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Flame, ShieldAlert } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OverviewTabProps {
  assessment: HEARTIAssessment;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);
  
  const topStrength = sortedDimensions[0];
  const developmentArea = sortedDimensions[sortedDimensions.length - 1];

  const getBadgeVariant = (score: number) => {
    if (score >= 4.5) return "default";
    if (score >= 3.5) return "secondary";
    if (score >= 2.5) return "outline";
    return "destructive";
  };
  
  const userColor = "#6366f1";

  // Spider chart configuration
  const spiderConfig = {
    gridType: "polygon" as "polygon",
    axisLineType: "polygon" as "polygon",
    strokeWidth: 2,
    fillOpacity: 0.6,
    dotSize: 5,
    activeDotSize: 8,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h3 className="text-lg font-medium mb-4">HEARTI:Leader Spectra</h3>
        <div className="bg-slate-50 p-4 rounded-lg h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid gridType={spiderConfig.gridType} />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ 
                  fill: '#6b7280', 
                  fontSize: isMobile ? 10 : 12 
                }} 
                axisLineType={spiderConfig.axisLineType}
                tickLine={false}
              />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
              <Radar
                name="Your HEARTI Spectra"
                dataKey="value"
                stroke={userColor}
                fill={userColor}
                fillOpacity={spiderConfig.fillOpacity}
                strokeWidth={spiderConfig.strokeWidth}
                dot={{ r: spiderConfig.dotSize }}
                activeDot={{ r: spiderConfig.activeDotSize }}
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={1000}
              />
              <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Overall Score</h3>
          <div className="flex items-center gap-2">
            <Badge className="text-lg py-1 px-3 score-pill" variant={getBadgeVariant(assessment.overallScore)}>
              {assessment.overallScore} / 5
            </Badge>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Dimension Scores</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(assessment.dimensionScores).map(([dimension, score]) => (
              <Badge 
                key={dimension} 
                variant={getBadgeVariant(score)}
                className="score-pill flex justify-between py-1 px-3"
              >
                <span>{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</span>
                <span>{score}/5</span>
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Key Insights</h3>
          <div className="space-y-4 text-sm">
            <div className="bg-green-50 p-3 rounded-md border border-green-100">
              <p className="font-medium flex items-center text-green-800">
                <Flame size={16} className="mr-2" />
                Top Strength: {topStrength.charAt(0).toUpperCase() + topStrength.slice(1)}
              </p>
              <p className="text-green-700 mt-1">{getFeedback(assessment.dimensionScores[topStrength], topStrength)}</p>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-100">
              <p className="font-medium flex items-center text-amber-800">
                <ShieldAlert size={16} className="mr-2" />
                Vulnerability: {developmentArea.charAt(0).toUpperCase() + developmentArea.slice(1)}
              </p>
              <p className="text-amber-700 mt-1">{getFeedback(assessment.dimensionScores[developmentArea], developmentArea)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
