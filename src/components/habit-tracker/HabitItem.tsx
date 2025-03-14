
import React from 'react';
import { format } from 'date-fns';
import { Habit } from '@/hooks/useHabits';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import HabitItemHeader from './HabitItemHeader';
import HabitCompletionBadge from './HabitCompletionBadge';
import HabitItemActions from './HabitItemActions';
import { useIsMobile } from '@/hooks/use-mobile';
import WeekHeader from './WeekHeader';
import HabitProgressCircle from './HabitProgressCircle';
import { completionGoals } from '@/constants/habitGoals';

interface HabitItemProps {
  habit: Habit;
  weekDates: Date[];
  onToggleCompletion: (date: Date) => void;
  onDelete: () => void;
  streak: number;
  completionGoals?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  weekDates,
  onToggleCompletion,
  onDelete,
  streak,
  completionGoals = completionGoals
}) => {
  const isMobile = useIsMobile();
  
  const getCompletionTarget = () => {
    return completionGoals[habit.frequency];
  };
  
  // Calculate progress percentage for the HabitProgressCircle
  const calculateProgress = (completedCount: number, target: number) => {
    return Math.min(Math.round((completedCount / target) * 100), 100);
  };
  
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="px-4 py-3 bg-gray-50">
        <HabitItemHeader 
          habit={habit} 
          streak={streak} 
          onDelete={onDelete}
          completedCount={habit.completedDates.length}
          completionTarget={getCompletionTarget()}
        />
      </CardHeader>
      
      <CardContent className={`px-2 py-2 ${isMobile ? 'pb-3' : 'pb-4'}`}>
        <div className="flex items-stretch">
          {/* Progress indicator */}
          <div className="w-16 flex-shrink-0 flex flex-col items-center justify-center p-1">
            <HabitProgressCircle 
              completedCount={habit.completedDates.length} 
              frequency={habit.frequency}
              completionTarget={getCompletionTarget()}
              progress={calculateProgress(habit.completedDates.length, getCompletionTarget())}
            />
            <div className="text-[10px] text-gray-500 mt-1 text-center">
              {habit.completedDates.length}/{getCompletionTarget()}
            </div>
          </div>
          
          {/* Week view */}
          <div className="flex-1 overflow-hidden">
            <WeekHeader weekDates={weekDates} />
            
            <div className="grid grid-cols-7 gap-1 mt-1">
              {weekDates.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const isCompleted = habit.completedDates.includes(dateStr);
                
                return (
                  <HabitCompletionBadge
                    key={dateStr}
                    date={date}
                    isCompleted={isCompleted}
                    onToggle={() => onToggleCompletion(date)}
                  />
                );
              })}
            </div>
          </div>
        </div>
        
        <HabitItemActions 
          streak={streak} 
          completedCount={habit.completedDates.length}
          goal={getCompletionTarget()}
        />
      </CardContent>
    </Card>
  );
};

export default HabitItem;
