
import React from 'react';
import { Circle } from 'lucide-react';
import { HEARTIDimension } from '@/types';

interface HabitProgressCircleProps {
  percentage: number;
  dimension: HEARTIDimension;
  size?: number;
  onClick?: () => void;
  completionCount?: number;
  targetCount?: number;
}

const dimensionProgressColors = {
  humility: { bg: '#E9D5FF', progress: '#9333EA' },
  empathy: { bg: '#DBEAFE', progress: '#3B82F6' },
  accountability: { bg: '#DCFCE7', progress: '#22C55E' },
  resiliency: { bg: '#FEF3C7', progress: '#F59E0B' },
  transparency: { bg: '#E0E7FF', progress: '#6366F1' },
  inclusivity: { bg: '#FCE7F3', progress: '#DB2777' }
};

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({
  percentage,
  dimension,
  size = 100,
  onClick,
  completionCount = 0,
  targetCount = 30
}) => {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (percentage / 100) * circumference;
  const center = size / 2;
  
  return (
    <div 
      className="relative cursor-pointer" 
      onClick={onClick}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={dimensionProgressColors[dimension].bg}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={dimensionProgressColors[dimension].progress}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold">{completionCount}</span>
        <span className="text-xs text-gray-500">{`of ${targetCount}`}</span>
      </div>
    </div>
  );
};

export default HabitProgressCircle;
