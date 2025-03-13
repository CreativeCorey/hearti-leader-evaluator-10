
import React from 'react';
import { Circle } from 'lucide-react';
import { completionGoals } from './HabitTrackerContent';

interface HabitProgressCircleProps {
  completedCount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
}

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({
  completedCount,
  frequency
}) => {
  // Get the target based on frequency
  const target = completionGoals[frequency];
  
  // Calculate percentage
  const percentage = Math.min(Math.round((completedCount / target) * 100), 100);
  
  // Determine color based on progress
  const getColor = () => {
    if (percentage >= 100) return '#10B981'; // Green for complete
    if (percentage >= 66) return '#6366F1';  // Purple for good progress
    if (percentage >= 33) return '#F59E0B';  // Amber for some progress
    return '#6B7280';                        // Gray for little progress
  };
  
  const color = getColor();
  const size = 36;
  
  // Calculate values for SVG
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Display completion status icon */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {percentage >= 100 ? (
          <div className="text-green-500">✓</div>
        ) : (
          <span className="text-[10px]" style={{ color }}>
            {completedCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default HabitProgressCircle;
