
import React from 'react';
import { Habit } from '@/hooks/useHabits';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/language/LanguageContext';
import HabitProgressCircle from './HabitProgressCircle';
import { dimensionColors } from '@/components/results/development/DimensionIcons';
import { completionGoals as defaultCompletionGoals } from '@/constants/habitGoals';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

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
  const dimensionColor = dimensionColors[habit.dimension] || '#6B7280';
  const completedCount = habit.completedDates?.length || 0;
  const completionTarget = completionGoals[habit.frequency];
  const progress = calculateProgress(completedCount, completionTarget);
  
  return (
    <div className="rounded-lg border bg-background shadow-sm hover:shadow transition-shadow">
      <div className="p-4 pb-2 flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">{habit.description}</h3>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span className="capitalize">{t(`results.habits.${habit.frequency}`)}</span>
            <span className="mx-1">•</span>
            {streak > 0 && (
              <>
                <span>{streak} {t('results.habits.dayStreak')}</span>
                <span className="mx-1">•</span>
              </>
            )}
            <span>{completedCount}/{completionTarget} {t('results.habits.completions')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <HabitProgressCircle
            completedCount={completedCount}
            frequency={habit.frequency}
            completionTarget={completionTarget}
            progress={progress}
          />
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-red-100 hover:text-red-600 text-gray-400"
              >
                <Trash2 size={14} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('results.habits.deleteHabit')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('results.habits.deleteConfirm')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                  {t('common.delete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
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
              <button
                className={`flex flex-col items-center justify-center rounded-md p-1 transition-colors 
                  ${isCompleted 
                    ? "bg-green-100 text-green-600 hover:bg-green-200" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"} 
                  h-8 w-8`}
                onClick={() => onToggleCompletion(date)}
              >
                <div className="text-xs font-medium">
                  {isCompleted ? "✓" : format(date, 'd')}
                </div>
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="px-4 pb-3 flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {t('results.habits.streak', { count: streak.toString() })}
        </Badge>
      </div>
    </div>
  );
};

// Helper function to calculate progress percentage
const calculateProgress = (completed: number, target: number): number => {
  return Math.min(Math.round((completed / target) * 100), 100);
};

export default HabitItem;
