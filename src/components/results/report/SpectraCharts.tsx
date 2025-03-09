
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useIsMobile } from '@/hooks/use-mobile';
import { Gauge, HeartHandshake, ChartNoAxesCombined, TreePalm, Blend, Users } from 'lucide-react';

interface SpectraChartsProps {
  assessment: HEARTIAssessment;
}

const aggregateData = {
  averageScores: {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  }
};

const SpectraCharts: React.FC<SpectraChartsProps> = ({ assessment }) => {
  const isMobile = useIsMobile();
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  const benchmarkData = formatDataForRadarChart(aggregateData.averageScores);
  
  const userColor = "#6366f1";
  const comparisonColors = {
    average: "#8b5cf6",
  };

  // Configuration for the spider chart appearance
  const spiderConfig = {
    gridType: "polygon" as "polygon",
    axisLineType: "polygon" as "polygon",
    outerRadius: isMobile ? 65 : 75,
    fillOpacity: 0.5,
    strokeWidth: 2,
    dotSize: 5,
    activeDotSize: 8,
  };
  
  const iconSize = isMobile ? 18 : 18;
  const iconColor = "text-gray-500";

  const ChartWithIcons = ({ data, title, chartColor }) => (
    <div className="relative">
      <p className="text-center font-medium text-lg text-indigo-600 mb-2">{title}</p>
      <div className={`h-[${isMobile ? '260px' : '320px'}] pdf-chart-container relative`}>
        {/* Icon overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top (Humility) - Adjusted position */}
          <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2">
            <Gauge size={iconSize} className={iconColor} />
          </div>
          
          {/* Top Right (Empathy) */}
          <div className="absolute top-[25%] right-[15%] transform">
            <HeartHandshake size={iconSize} className={iconColor} />
          </div>
          
          {/* Bottom Right (Accountability) */}
          <div className="absolute bottom-[25%] right-[15%] transform">
            <ChartNoAxesCombined size={iconSize} className={iconColor} />
          </div>
          
          {/* Bottom (Resiliency) - Adjusted position */}
          <div className="absolute bottom-[10%] left-[50%] transform -translate-x-1/2">
            <TreePalm size={iconSize} className={iconColor} />
          </div>
          
          {/* Bottom Left (Transparency) */}
          <div className="absolute bottom-[25%] left-[15%] transform">
            <Blend size={iconSize} className={iconColor} />
          </div>
          
          {/* Top Left (Inclusivity) */}
          <div className="absolute top-[25%] left-[15%] transform">
            <Users size={iconSize} className={iconColor} />
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius={`${spiderConfig.outerRadius}%`} 
            data={data}
          >
            <PolarGrid gridType={spiderConfig.gridType} />
            <PolarAngleAxis 
              dataKey="name" 
              tick={false} 
              axisLineType={spiderConfig.axisLineType}
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
              fillOpacity={spiderConfig.fillOpacity}
              strokeWidth={spiderConfig.strokeWidth}
              dot={{ r: spiderConfig.dotSize }}
              activeDot={{ r: spiderConfig.activeDotSize }}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="my-8 pdf-section">
      <h3 className="text-2xl font-medium mb-4 pdf-section-title">Your HEARTI:Leader Spectra</h3>
      <div className={`flex flex-col ${isMobile ? '' : 'lg:flex-row'} gap-4 pdf-charts-grid`}>
        <div className={`flex-1 bg-slate-50 p-4 rounded-lg pdf-chart-column ${isMobile ? 'mb-6' : ''}`}>
          <ChartWithIcons 
            data={chartData} 
            title="Your HEARTI Spectra" 
            chartColor={userColor} 
          />
        </div>
        
        {!isMobile && (
          <div className="flex-1 bg-slate-50 p-4 rounded-lg pdf-chart-column">
            <ChartWithIcons 
              data={benchmarkData} 
              title="Global HEARTI:Leader Benchmark" 
              chartColor={comparisonColors.average} 
            />
          </div>
        )}
      </div>
      
      {isMobile && (
        <div className="flex-1 bg-slate-50 p-4 rounded-lg pdf-chart-column mt-4">
          <ChartWithIcons 
            data={benchmarkData} 
            title="Global HEARTI:Leader Benchmark" 
            chartColor={comparisonColors.average} 
          />
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mt-4">
        The HEARTI:Leader Quotient report provides you with information about your strengths and areas that you can develop further. 
        {isMobile ? 'The visualizations above show your HEARTI competencies and the global benchmark for comparison.' : 
        'On the left side is your HEARTI:Leader Spectra - a visualization of your HEARTI competencies based on your responses. On the right is the global benchmark for visual comparison.'} 
        This information is a reference point only. 
        No leader is strongest in every competency, but learning how your results compare to other 21st century leaders can be insightful.
      </p>
    </div>
  );
};

export default SpectraCharts;
