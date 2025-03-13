
import React from 'react';
import { Sparkles, Medal } from 'lucide-react';

interface HabitItemActionsProps {
  streak: number;
  completedCount: number;
  goal: number;
}

const HabitItemActions: React.FC<HabitItemActionsProps> = ({ 
  streak, 
  completedCount,
  goal
}) => {
  // Calculate progress percentage
  const progress = Math.min(Math.round((completedCount / goal) * 100), 100);
  
  return (
    <div className="flex items-center justify-between mt-2 pl-2 pr-1">
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        {streak > 0 && (
          <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            <Sparkles size={12} className="mr-1" />
            <span className="font-medium">{streak} day streak</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {completedCount >= goal ? (
          <div className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-xs">
            <Medal size={12} className="mr-1" />
            <span className="font-medium">Mastered!</span>
          </div>
        ) : completedCount > 0 ? (
          <div className="text-xs text-gray-500 px-2">
            {progress}% complete
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HabitItemActions;
