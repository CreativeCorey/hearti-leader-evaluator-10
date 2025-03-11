
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ChartData } from '@/types';

interface RadarSpectraChartProps {
  data: ChartData;
  title: string;
  chartColor: string;
  className?: string;
}

const RadarSpectraChart: React.FC<RadarSpectraChartProps> = ({ 
  data, 
  title, 
  chartColor, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <h4 className="text-md font-medium text-center text-gray-700">{title}</h4>
      <div className="pdf-chart-container radar-base h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="80%" 
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <PolarGrid 
              gridType="polygon" 
              stroke="#d1d5db" 
              strokeDasharray="3 3"
              // Remove the invalid polarGridStrokeOpacity property
              strokeOpacity={0.7}
            />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ 
                fill: '#6b7280', 
                fontSize: 10,
                fontWeight: 500
              }} 
              axisLineType="polygon"
              tickLine={false}
              stroke="#d1d5db"
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 5]} 
              tick={{ 
                fill: '#9ca3af',
                fontSize: 9,
                opacity: 0.8
              }} 
              stroke="#e5e7eb"
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke={chartColor}
              fill={chartColor}
              fillOpacity={0.6}
              dot={{ fill: chartColor, r: 3 }}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarSpectraChart;
