
import React from 'react';

interface HabitProgressCircleProps {
  completedCount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  completionTarget: number;
  progress: number;
}

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({ 
  completedCount, 
  frequency, 
  completionTarget,
  progress 
}) => {
  // Size and stroke width for our SVG circle
  const size = 36;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate the stroke dash offset based on progress (0-100%)
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Determine color based on progress
  const getColor = () => {
    if (progress >= 100) return '#16a34a'; // Green for completed
    if (progress >= 75) return '#2563eb'; // Blue for good progress
    if (progress >= 50) return '#d97706'; // Orange for medium progress
    if (progress >= 25) return '#ef4444'; // Red for starting progress
    return '#94a3b8'; // Gray for low progress
  };
  
  return (
    <div className="relative h-9 w-9 flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Display progress percentage in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold" style={{ color: getColor() }}>
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default HabitProgressCircle;
