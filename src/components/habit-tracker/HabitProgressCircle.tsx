
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HabitProgressCircleProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  infoText?: string;
}

const HabitProgressCircle: React.FC<HabitProgressCircleProps> = ({
  progress,
  size = 'md',
  showLabel = true,
  className = '',
  infoText
}) => {
  // Convert progress to percentage capped at 100%
  const percentage = Math.min(Math.round(progress), 100);
  
  // Determine size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };
  
  // Get color based on progress
  const getColorClass = () => {
    if (percentage >= 100) return 'bg-emerald-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-amber-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className={cn(`relative flex items-center justify-center ${sizeClasses[size]}`, className)}>
      <Progress 
        value={percentage} 
        className="h-2 w-full absolute rounded-full" 
      />
      
      {showLabel && (
        <div className="text-center">
          <p className="font-semibold text-lg">{percentage}%</p>
          {infoText && <p className="text-xs text-muted-foreground">{infoText}</p>}
        </div>
      )}
    </div>
  );
};

export default HabitProgressCircle;
