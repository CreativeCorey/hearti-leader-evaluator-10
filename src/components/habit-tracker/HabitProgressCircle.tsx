import React from 'react';
import { Circle } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { dimensionColors } from '../results/development/DimensionIcons';

interface HabitProgressCircleProps {
  percentage: number;
  dimension: HEARTIDimension;
  size?: number;
  onClick?: () => void;
  completionCount?: number;
  targetCount?: number;
}

const dimensionProgressColors = {
  humility: { bg: '#5B0F58/20', progress: dimensionColors.humility },
  empathy: { bg: '#18B7D9/20', progress: dimensionColors.empathy },
  accountability: { bg: '#00A249/20', progress: dimensionColors.accountability },
  resiliency: { bg: '#FFCC33/20', progress: dimensionColors.resiliency },
  transparency: { bg: '#3953A4/20', progress: dimensionColors.transparency },
  inclusivity: { bg: '#EE2D67/20', progress: dimensionColors.inclusivity }
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
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={dimensionProgressColors[dimension].bg}
          fill="none"
        />
        
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
