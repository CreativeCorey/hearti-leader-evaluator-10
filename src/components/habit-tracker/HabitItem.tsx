
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Habit } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language/LanguageContext';
import HabitItemHeader from './HabitItemHeader';
import HabitItemActions from './HabitItemActions';
import HabitProgressCircle from './HabitProgressCircle';
import { cn } from '@/lib/utils';
import HabitNotificationsToggle from './HabitNotificationsToggle';

interface HabitItemProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggleComplete: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  skippedToday: boolean;
  onSkipToday: (habitId: string) => void;
  index?: number;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isCompletedToday,
  onToggleComplete,
  onDelete,
  skippedToday,
  onSkipToday,
  index = 0,
}) => {
  const { id, description, dimension, completedDates = [], frequency } = habit;
  const { t } = useLanguage();
  
  const completionCount = completedDates?.length || 0;
  const habitId = typeof id === 'string' ? id : index.toString();
  
  return (
    <div className={cn(
      "mb-3 p-4 border rounded-lg shadow-sm transition-all",
      isCompletedToday ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : 
      skippedToday ? "bg-gray-50 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700" : 
      "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
    )}>
      <HabitItemHeader
        description={description}
        dimension={dimension}
        completedToday={isCompletedToday}
        skippedToday={skippedToday}
        frequency={frequency}
      />
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <HabitProgressCircle completedCount={completionCount} />
          
          <div className="flex flex-col">
            <Badge variant="outline" className="text-xs mb-1 font-normal px-2">
              {t(`results.habits.${frequency}`, { fallback: frequency })}
            </Badge>
            <HabitNotificationsToggle 
              habitTitle={description} 
              frequency={frequency as 'daily' | 'weekly' | 'monthly'}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isCompletedToday && !skippedToday && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onToggleComplete(habitId)}
            >
              <Circle className="mr-1 h-3 w-3" />
              {t('results.habits.markComplete', { fallback: "Mark Complete" })}
            </Button>
          )}
          
          {isCompletedToday && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50"
              onClick={() => onToggleComplete(habitId)}
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {t('results.habits.complete', { fallback: "Complete" })}
            </Button>
          )}
          
          <HabitItemActions
            habitId={habitId}
            onDelete={onDelete}
            onSkipToday={onSkipToday}
            isCompletedToday={isCompletedToday}
            skippedToday={skippedToday}
          />
        </div>
      </div>
    </div>
  );
};

export default HabitItem;
