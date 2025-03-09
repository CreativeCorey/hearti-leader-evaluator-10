
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Plus, Minus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitItemActionsProps {
  isCompletedToday: boolean;
  isHabitMastered: boolean;
  onToggleHabit: () => void;
}

const HabitItemActions: React.FC<HabitItemActionsProps> = ({
  isCompletedToday,
  isHabitMastered,
  onToggleHabit
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'mt-3' : 'mt-4'}`}>
      <Button 
        className={`w-full ${isMobile ? 'py-1.5 px-3 text-sm h-auto' : ''} ${isHabitMastered ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
        onClick={onToggleHabit}
      >
        {isCompletedToday ? (
          <>
            <Check size={isMobile ? 14 : 16} className="mr-1.5" />
            Completed Today
          </>
        ) : (
          <>
            {isMobile ? 'Mark Complete' : 'Complete'}
          </>
        )}
      </Button>
      
      {!isCompletedToday && (
        <Button 
          variant="ghost" 
          className={`w-full ${isMobile ? 'mt-1 text-xs py-1 h-auto' : 'mt-2'} text-indigo-600`}
          onClick={onToggleHabit}
        >
          Skip today
        </Button>
      )}
    </div>
  );
};

export default HabitItemActions;
