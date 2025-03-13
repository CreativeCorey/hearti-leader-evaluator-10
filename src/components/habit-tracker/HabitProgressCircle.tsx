
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface HabitProgressCircleProps {
  completedCount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  completionTarget?: number;
}

// Default completion goals now updated
const DEFAULT_COMPLETION_GOALS = {
  daily: 30,
  weekly: 12,
  monthly: 6
};

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({ 
  completedCount, 
  frequency,
  completionTarget
}) => {
  // Use provided completionTarget or get the default based on frequency
  const target = completionTarget || DEFAULT_COMPLETION_GOALS[frequency];
  
  // Calculate completion percentage, capped at 100%
  const percentage = Math.min(Math.round((completedCount / target) * 100), 100);
  
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
          className="h-12 w-12 rounded-full [&>div]:rounded-full"
          indicatorClassName={getProgressColor()}
        />
      </div>
      <span className={`text-xs font-semibold ${percentage >= 100 ? 'text-green-700' : ''}`}>
        {percentage}%
      </span>
    </div>
  );
};

export default HabitProgressCircle;
