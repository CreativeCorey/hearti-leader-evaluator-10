
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { Habit } from '@/hooks/useHabits';
import { useIsMobile } from '@/hooks/use-mobile';
import HabitProgressCircle from './HabitProgressCircle';
import HabitItemHeader from './HabitItemHeader';
import HabitItemTitle from './HabitItemTitle';
import HabitItemActions from './HabitItemActions';
import HabitCompletionBadge from './HabitCompletionBadge';

interface HabitItemProps {
  habit: Habit;
  streakCount: number;
  onToggleHabit: (habitId: string | undefined, date: Date) => void;
  onDeleteHabit: (habitId: string | undefined) => void;
}

const TARGET_COMPLETIONS = 30;

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  streakCount,
  onToggleHabit,
  onDeleteHabit
}) => {
  const isMobile = useIsMobile();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const isCompletedToday = habit.completedDates.includes(todayStr);
  
  const completionCount = habit.completedDates.length;
  const completionPercentage = Math.min((completionCount / TARGET_COMPLETIONS) * 100, 100);
  const isHabitMastered = completionCount >= TARGET_COMPLETIONS;
  
  return (
    <div className={`bg-white rounded-xl ${isMobile ? 'p-3' : 'p-5'} shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${isHabitMastered ? 'border-2 border-green-300' : ''}`}>
      <HabitItemHeader
        dimension={habit.dimension}
        frequency={habit.frequency}
        isHabitMastered={isHabitMastered}
        onDeleteHabit={() => onDeleteHabit(habit.id)}
      />
      
      <HabitItemTitle
        dimension={habit.dimension}
        description={habit.description}
        streakCount={streakCount}
      />
      
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'justify-between items-center'} mt-3`}>
        <div className={`${isMobile ? 'mb-3' : 'flex-1'} flex items-center justify-center`}>
          <HabitProgressCircle 
            percentage={completionPercentage}
            dimension={habit.dimension} 
            size={isMobile ? 80 : 100}
            onClick={() => onToggleHabit(habit.id, today)}
            completionCount={completionCount}
            targetCount={TARGET_COMPLETIONS}
          />
        </div>
        
        {!isMobile && (
          <div className="flex-1 flex items-center justify-center gap-4">
            <Button 
              variant="outline"
              size="sm"
              className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-slate-50"
              onClick={() => onToggleHabit(habit.id, today)}
            >
              <Minus size={18} />
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-slate-50"
              onClick={() => onToggleHabit(habit.id, today)}
            >
              <Plus size={18} />
            </Button>
          </div>
        )}
      </div>
      
      <HabitItemActions
        isCompletedToday={isCompletedToday}
        isHabitMastered={isHabitMastered}
        onToggleHabit={() => onToggleHabit(habit.id, today)}
      />
      
      {isHabitMastered && <HabitCompletionBadge />}
    </div>
  );
};

export default HabitItem;
