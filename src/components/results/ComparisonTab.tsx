
import React, { useState } from 'react';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';

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
  const [compareMode, setCompareMode] = useState<'none' | 'average' | 'men' | 'women'>('none');
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const sortedDimensions = Object.entries(assessment.dimensionScores)
    .sort(([, a], [, b]) => b - a)
    .map(([dimension]) => dimension as HEARTIDimension);

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
    if (score >= 4.5) return "default";
    if (score >= 3.5) return "secondary";
    if (score >= 2.5) return "outline";
    return "destructive";
  };

  const getComparisonLabel = () => {
    switch (compareMode) {
      case 'average': return 'Average';
      case 'men': return 'Men';
      case 'women': return 'Women';
      default: return '';
    }
  };

  const userColor = "#6366f1";
  const comparisonColors = {
    average: "#8b5cf6",
    men: "#ec4899",
    women: "#f97316"
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
            variant={compareMode === 'average' ? "default" : "outline"}
            onClick={() => setCompareMode('average')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Users size={16} className="mr-1" /> Average
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'men' ? "default" : "outline"}
            onClick={() => setCompareMode('men')}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Men
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'women' ? "default" : "outline"}
            onClick={() => setCompareMode('women')}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Women
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs mb-4">
          <Button 
            size="sm" 
            variant={chartView === 'combined' ? "default" : "ghost"}
            className="rounded-md text-xs h-7"
            onClick={() => setChartView('combined')}
          >
            Combined
          </Button>
          <Button 
            size="sm" 
            variant={chartView === 'separate' ? "default" : "ghost"}
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
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                <Radar
                  name="Your Score"
                  dataKey="value"
                  stroke={userColor}
                  fill={userColor}
                  fillOpacity={0.6}
                />
                {compareMode !== 'none' && (
                  <Radar
                    name={getComparisonLabel()}
                    dataKey="comparisonValue"
                    stroke={getComparisonColor()}
                    fill={getComparisonColor()}
                    fillOpacity={0.6}
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
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Radar
                    name="Your Score"
                    dataKey="value"
                    stroke={userColor}
                    fill={userColor}
                    fillOpacity={0.6}
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
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Radar
                      name={getComparisonLabel()}
                      dataKey="value"
                      stroke={getComparisonColor()}
                      fill={getComparisonColor()}
                      fillOpacity={0.6}
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
