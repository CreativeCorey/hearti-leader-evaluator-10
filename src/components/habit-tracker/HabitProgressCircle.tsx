
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { completionGoals } from '@/constants/habitGoals';

interface HabitProgressCircleProps {
  completedCount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  completionTarget?: number;
  progress: number;
}

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({ 
  completedCount, 
  frequency,
  completionTarget,
  progress
}) => {
  // Use provided completionTarget or get the default based on frequency
  const target = completionTarget || completionGoals[frequency];
  
  // Calculate completion percentage, capped at 100% (use provided progress or calculate)
  const percentage = progress !== undefined ? progress : Math.min(Math.round((completedCount / target) * 100), 100);
  
  // Determine color based on completion percentage
  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-amber-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-gray-400';
  };
  
  return (
    <div className="w-12 h-12 relative flex items-center justify-center">
      <div className="absolute inset-0">
        <Progress
          value={percentage}
          className={`h-12 w-12 rounded-full [&>div]:rounded-full ${getProgressColor()}`}
        />
      </div>
      <span className={`text-xs font-semibold ${percentage >= 100 ? 'text-green-700' : ''}`}>
        {percentage}%
      </span>
    </div>
  );
};

export default HabitProgressCircle;
