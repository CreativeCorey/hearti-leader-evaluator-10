
import React from 'react';
import { HEARTIDimension } from '@/types';

interface HabitProgressCircleProps {
  percentage: number;
  dimension: HEARTIDimension;
  size?: number;
  strokeWidth?: number;
  onClick?: () => void;
}

const dimensionProgressColors = {
  humility: { bg: '#E9D5FF', progress: '#8B5CF6' }, // purple
  empathy: { bg: '#DBEAFE', progress: '#1E40AF' }, // blue
  accountability: { bg: '#DCFCE7', progress: '#22C55E' }, // green
  resiliency: { bg: '#FEF3C7', progress: '#F59E0B' }, // yellow/orange
  transparency: { bg: '#E0E7FF', progress: '#4F46E5' }, // indigo
  inclusivity: { bg: '#FCE7F3', progress: '#EC4899' }  // pink
};

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({
  percentage,
  dimension,
  size = 120,
  strokeWidth = 12,
  onClick
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colors = dimensionProgressColors[dimension];
  
  return (
    <div 
      className="relative inline-flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={colors.bg}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={colors.progress}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Display the value in the middle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">
          {percentage === 100 ? '✓' : '0'}
        </span>
        <span className="text-xs text-gray-500">
          {percentage === 100 ? 'Complete' : 'Tap to complete'}
        </span>
      </div>
    </div>
  );
};

export default HabitProgressCircle;
