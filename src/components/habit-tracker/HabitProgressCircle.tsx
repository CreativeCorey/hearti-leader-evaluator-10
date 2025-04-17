
import React from 'react';
import { HabitProgressCircleProps } from '@/types';

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({
  completedCount,
  frequency,
  completionTarget,
  progress
}) => {
  // Convert progress to percentage for display
  const percentage = Math.round(progress * 100);
  
  // Determine color based on progress
  const getColor = () => {
    if (progress >= 1) return '#22c55e'; // green-500
    if (progress >= 0.7) return '#3b82f6'; // blue-500
    if (progress >= 0.3) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };
  
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="w-10 h-10">
        {/* Background circle */}
        <circle 
          cx="18" 
          cy="18" 
          r="15.91549430918954" 
          fill="none" 
          stroke="#e5e7eb" 
          strokeWidth="2"
        />
        
        {/* Progress circle */}
        <circle 
          cx="18" 
          cy="18" 
          r="15.91549430918954" 
          fill="none" 
          stroke={getColor()} 
          strokeWidth="2" 
          strokeDasharray={`${progress * 100} ${100 - progress * 100}`} 
          strokeDashoffset="25" 
          className="transition-all duration-500"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center font-medium text-xs">
        {completedCount}
      </div>
    </div>
  );
};

export default HabitProgressCircle;
