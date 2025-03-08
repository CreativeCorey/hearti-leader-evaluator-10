
import React from 'react';
import { HEARTIDimension } from '@/types';
import { Hexagon } from 'lucide-react';

interface HabitProgressCircleProps {
  percentage: number;
  dimension: HEARTIDimension;
  size?: number;
  strokeWidth?: number;
  onClick?: () => void;
}

const dimensionProgressColors = {
  humility: { bg: '#E9D5FF', progress: 'url(#gradientPurpleBlue)' }, // purple gradient
  empathy: { bg: '#DBEAFE', progress: 'url(#gradientBlue)' }, // blue gradient
  accountability: { bg: '#DCFCE7', progress: 'url(#gradientGreenYellow)' }, // green-yellow gradient
  resiliency: { bg: '#FEF3C7', progress: 'url(#gradientPrimary)' }, // primary gradient
  transparency: { bg: '#E0E7FF', progress: 'url(#gradientBlue)' }, // blue gradient
  inclusivity: { bg: '#FCE7F3', progress: 'url(#gradientRedPink)' }  // red-pink gradient
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
        {/* SVG Gradient Definitions */}
        <defs>
          <linearGradient id="gradientPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFBA08" />
            <stop offset="50%" stopColor="#E02639" />
            <stop offset="75%" stopColor="#9E0059" />
            <stop offset="100%" stopColor="#390099" />
          </linearGradient>
          <linearGradient id="gradientRedPink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E02639" />
            <stop offset="100%" stopColor="#9E0059" />
          </linearGradient>
          <linearGradient id="gradientPurpleBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9E0059" />
            <stop offset="100%" stopColor="#390099" />
          </linearGradient>
          <linearGradient id="gradientGreenYellow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#52B788" />
            <stop offset="100%" stopColor="#DDE02A" />
          </linearGradient>
          <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#00B4D8" />
          </linearGradient>
        </defs>
        
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
        {percentage === 100 ? (
          <Hexagon size={32} className="text-green fill-green/20" />
        ) : (
          <span className="text-3xl font-bold">0</span>
        )}
        <span className="text-xs text-gray-500 mt-1">
          {percentage === 100 ? 'Complete' : 'Tap to complete'}
        </span>
      </div>
    </div>
  );
};

export default HabitProgressCircle;
