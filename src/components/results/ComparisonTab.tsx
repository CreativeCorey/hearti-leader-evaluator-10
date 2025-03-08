
import React, { useState } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
}

// Aggregated comparison data
const aggregateData = {
  averageScores: {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  },
  demographics: {
    gender: {
      men: {
        humility: 3.6,
        empathy: 3.5,
        accountability: 4.0,
        resiliency: 3.8,
        transparency: 3.7,
        inclusivity: 3.3
      },
      women: {
        humility: 4.0,
        empathy: 3.9,
        accountability: 4.2,
        resiliency: 3.6,
        transparency: 4.1,
        inclusivity: 3.8
      }
    }
  }
};

const ComparisonTab: React.FC<ComparisonTabProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const [compareMode, setCompareMode] = useState<'none' | 'average' | 'men' | 'women'>('none');
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);

  // Spider chart configuration
  const spiderConfig = {
    gridType: "polygon" as "polygon",
    axisLineType: "polygon" as "polygon",
    strokeWidth: 2,
    fillOpacity: 0.6,
    dotSize: 5,
    activeDotSize: 8,
  };

  const getComparisonData = () => {
    if (compareMode === 'none') {
      return null;
    }
    
    let comparisonScores;
    
    if (compareMode === 'average') {
      comparisonScores = aggregateData.averageScores;
    } else if (compareMode === 'men') {
      comparisonScores = aggregateData.demographics.gender.men;
    } else if (compareMode === 'women') {
      comparisonScores = aggregateData.demographics.gender.women;
    }
    
    if (comparisonScores) {
      return formatDataForRadarChart(comparisonScores);
    }
    
    return null;
  };
  
  const combinedChartData = chartData.map((item, index) => {
    const comparisonData = getComparisonData();
    if (comparisonData) {
      return {
        ...item,
        comparisonValue: comparisonData[index].value
      };
    }
    return item;
  });

  const getBadgeVariant = (score: number) => {
    if (score >= 4.5) return "gradient-green";
    if (score >= 3.5) return "gradient-blue";
    if (score >= 2.5) return "gradient";
    return "gradient-red";
  };

  const getComparisonLabel = () => {
    switch (compareMode) {
      case 'average': return 'Average';
      case 'men': return 'Men';
      case 'women': return 'Women';
      default: return '';
    }
  };

  // Modern gradient colors matching the palette
  const userColor = "#6366f1";
  const comparisonColors = {
    average: "#9E0059", // Purple from gradient
    men: "#E02639", // Red from gradient
    women: "#390099" // Blue from gradient
  };

  const getComparisonColor = () => {
    switch (compareMode) {
      case 'average': return comparisonColors.average;
      case 'men': return comparisonColors.men;
      case 'women': return comparisonColors.women;
      default: return "#000000";
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Compare Your Results</h3>
          <p className="text-sm text-muted-foreground">See how your scores compare to others</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant={compareMode === 'none' ? "default" : "outline"}
            onClick={() => setCompareMode('none')}
          >
            No Comparison
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'average' ? "gradient-purple" : "outline"}
            onClick={() => setCompareMode('average')}
            className="hover:bg-purple-700"
          >
            <Users size={16} className="mr-1" /> Average
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'men' ? "gradient-red" : "outline"}
            onClick={() => setCompareMode('men')}
            className="hover:bg-red-700"
          >
            Men
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'women' ? "gradient-blue" : "outline"}
            onClick={() => setCompareMode('women')}
            className="hover:bg-blue-700"
          >
            Women
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs mb-4">
          <Button 
            size="sm" 
            variant={chartView === 'combined' ? "gradient" : "ghost"}
            className="rounded-md text-xs h-7"
            onClick={() => setChartView('combined')}
          >
            Combined
          </Button>
          <Button 
            size="sm" 
            variant={chartView === 'separate' ? "gradient" : "ghost"}
            className="rounded-md text-xs h-7"
            onClick={() => setChartView('separate')}
          >
            Separate
          </Button>
        </div>
      
        {chartView === 'combined' ? (
          <div className="bg-slate-50 p-6 rounded-lg h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={combinedChartData}>
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
                  name="Your Score"
                  dataKey="value"
                  stroke={userColor}
                  fill={userColor}
                  fillOpacity={spiderConfig.fillOpacity}
                  strokeWidth={spiderConfig.strokeWidth}
                  dot={{ r: spiderConfig.dotSize }}
                  activeDot={{ r: spiderConfig.activeDotSize }}
                  isAnimationActive={true}
                  animationBegin={100}
                  animationDuration={1000}
                />
                {compareMode !== 'none' && (
                  <Radar
                    name={getComparisonLabel()}
                    dataKey="comparisonValue"
                    stroke={getComparisonColor()}
                    fill={getComparisonColor()}
                    fillOpacity={spiderConfig.fillOpacity}
                    strokeWidth={spiderConfig.strokeWidth}
                    dot={{ r: spiderConfig.dotSize }}
                    activeDot={{ r: spiderConfig.activeDotSize }}
                    isAnimationActive={true}
                    animationBegin={200}
                    animationDuration={1000}
                  />
                )}
                <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
              <p className="text-center font-medium text-indigo-600 mb-2">Your Results</p>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid gridType={spiderConfig.gridType} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ 
                      fill: '#6b7280', 
                      fontSize: isMobile ? 8 : 10 
                    }} 
                    axisLineType={spiderConfig.axisLineType}
                    tickLine={false}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: isMobile ? 8 : 10 }} />
                  <Radar
                    name="Your Score"
                    dataKey="value"
                    stroke={userColor}
                    fill={userColor}
                    fillOpacity={spiderConfig.fillOpacity}
                    strokeWidth={spiderConfig.strokeWidth}
                    dot={{ r: spiderConfig.dotSize }}
                    activeDot={{ r: spiderConfig.activeDotSize }}
                    isAnimationActive={true}
                    animationBegin={100}
                    animationDuration={1000}
                  />
                  <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {compareMode !== 'none' && (
              <div className="bg-slate-50 p-4 rounded-lg h-[300px]">
                <p className="text-center font-medium" style={{ color: getComparisonColor() }}>{getComparisonLabel()} Results</p>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getComparisonData()}>
                    <PolarGrid gridType={spiderConfig.gridType} />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ 
                        fill: '#6b7280', 
                        fontSize: isMobile ? 8 : 10 
                      }} 
                      axisLineType={spiderConfig.axisLineType}
                      tickLine={false}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: isMobile ? 8 : 10 }} />
                    <Radar
                      name={getComparisonLabel()}
                      dataKey="value"
                      stroke={getComparisonColor()}
                      fill={getComparisonColor()}
                      fillOpacity={spiderConfig.fillOpacity}
                      strokeWidth={spiderConfig.strokeWidth}
                      dot={{ r: spiderConfig.dotSize }}
                      activeDot={{ r: spiderConfig.activeDotSize }}
                      isAnimationActive={true}
                      animationBegin={100}
                      animationDuration={1000}
                    />
                    <Tooltip formatter={(value) => [`${value}/5`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
        
        {compareMode !== 'none' && (
          <div className="mt-6">
            <h4 className="text-md font-medium mb-2">Comparison Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedDimensions.map((dimension) => {
                const userScore = assessment.dimensionScores[dimension];
                let comparisonScore = 0;
                
                if (compareMode === 'average') {
                  comparisonScore = aggregateData.averageScores[dimension];
                } else if (compareMode === 'men') {
                  comparisonScore = aggregateData.demographics.gender.men[dimension];
                } else if (compareMode === 'women') {
                  comparisonScore = aggregateData.demographics.gender.women[dimension];
                }
                
                const difference = userScore - comparisonScore;
                const differenceText = difference > 0 
                  ? `${difference.toFixed(1)} higher than` 
                  : difference < 0 
                    ? `${Math.abs(difference).toFixed(1)} lower than` 
                    : 'same as';
                    
                return (
                  <div key={dimension} className="p-3 bg-white rounded-md border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{dimension.charAt(0).toUpperCase() + dimension.slice(1)}</span>
                      <div className="flex gap-2 items-center">
                        <Badge variant={getBadgeVariant(userScore)}>
                          You: {userScore}
                        </Badge>
                        <span className="text-gray-500">|</span>
                        <Badge variant="outline" style={{ color: getComparisonColor(), borderColor: getComparisonColor() }}>
                          {getComparisonLabel()}: {comparisonScore}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your score is {differenceText} the {getComparisonLabel().toLowerCase()} score.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTab;
