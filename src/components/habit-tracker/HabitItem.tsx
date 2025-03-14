import React from 'react';
import { Habit } from '@/hooks/useHabits';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/language/LanguageContext';
import HabitProgressCircle from './HabitProgressCircle';
import HabitItemHeader from './HabitItemHeader';
import HabitItemTitle from './HabitItemTitle';
import HabitItemActions from './HabitItemActions';
import CompletedHabitBadge from './CompletedHabitBadge';
import HabitCompletionBadge from './HabitCompletionBadge';
import { completionGoals as defaultCompletionGoals } from '@/constants/habitGoals';

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
  completionGoals = defaultCompletionGoals
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="rounded-lg border bg-background shadow-sm hover:shadow transition-shadow">
      <HabitItemHeader>
        <HabitItemTitle title={habit.title} frequency={habit.frequency} />
        <HabitProgressCircle 
          completedCount={habit.completedDates?.length || 0} 
          frequency={habit.frequency}
          completionTarget={completionGoals[habit.frequency]}
          progress={calculateProgress(habit.completedDates?.length || 0, completionGoals[habit.frequency])}
        />
      </HabitItemHeader>
      
      <div className="p-4 pt-0 grid grid-cols-7 gap-2">
        {weekDates.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isCompleted = habit.completedDates?.includes(dateStr);
          
          return (
            <div key={dateStr} className="flex flex-col items-center">
              <p className="text-xs text-muted-foreground mb-1">
                {format(date, 'EEE')}
              </p>
              <p className="text-xs mb-2">
                {format(date, 'd')}
              </p>
              <HabitCompletionBadge 
                isCompleted={isCompleted} 
                onToggle={() => onToggleCompletion(date)} 
              />
            </div>
          );
        })}
      </div>
      
      <div className="px-4 pb-3 flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {t('results.habits.streak', { count: streak })}
        </Badge>
        <HabitItemActions onDelete={onDelete} />
      </div>
    </div>
  );
};

// Helper function to calculate progress percentage
const calculateProgress = (completed: number, target: number): number => {
  return Math.min(Math.round((completed / target) * 100), 100);
};

export default HabitItem;
