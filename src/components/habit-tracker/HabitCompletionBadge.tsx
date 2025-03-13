
import React from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitCompletionBadgeProps {
  date: Date;
  isCompleted: boolean;
  onToggle: () => void;
}

const HabitCompletionBadge: React.FC<HabitCompletionBadgeProps> = ({
  date,
  isCompleted,
  onToggle
}) => {
  const isMobile = useIsMobile();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  const isToday = date.getTime() === today.getTime();
  const isPast = date < today;
  const isFuture = date > today;
  
  const dayOfMonth = format(date, 'd');
  
  // Determine badge styling based on completion status and date
  const getBadgeStyling = () => {
    if (isCompleted) {
      return "bg-green-100 text-green-600 hover:bg-green-200";
    }
    
    if (isToday) {
      return "bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-blue-300";
    }
    
    if (isPast) {
      return "bg-gray-100 text-gray-600 hover:bg-gray-200";
    }
    
    return "bg-gray-50 text-gray-400 hover:bg-gray-100";
  };
  
  return (
    <button
      className={`flex flex-col items-center justify-center rounded-md p-1 transition-colors ${getBadgeStyling()} ${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`}
      onClick={onToggle}
      disabled={isFuture}
    >
      <div className={`text-xs font-medium ${isFuture ? 'opacity-50' : ''}`}>
        {isCompleted ? (
          <Check size={isMobile ? 16 : 18} className="mx-auto" />
        ) : (
          dayOfMonth
        )}
      </div>
    </button>
  );
};

export default HabitCompletionBadge;
