
import React from 'react';
import { Habit } from '@/hooks/useHabits';
import { dimensionColors } from '@/components/results/development/DimensionIcons';
import HabitItemTitle from './HabitItemTitle';
import CompletedHabitBadge from './CompletedHabitBadge';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface HabitItemHeaderProps {
  habit: Habit;
  streak: number;
  onDelete: () => void;
  completedCount: number;
  completionTarget?: number;
}

const HabitItemHeader: React.FC<HabitItemHeaderProps> = ({ 
  habit, 
  streak, 
  onDelete,
  completedCount,
  completionTarget = 30
}) => {
  const isCompleted = completedCount >= completionTarget;
  
  const dimensionColor = dimensionColors[habit.dimension] || '#6B7280';
  
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <HabitItemTitle
          habit={habit}
          dimensionColor={dimensionColor}
        />
        
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span className="capitalize">{habit.frequency}</span>
          <span className="mx-1">•</span>
          {streak > 0 && (
            <>
              <span>{streak} day streak</span>
              <span className="mx-1">•</span>
            </>
          )}
          <span>{completedCount}/{completionTarget} completions</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isCompleted && <CompletedHabitBadge />}
        
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
              <AlertDialogTitle>Delete Habit</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this habit? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default HabitItemHeader;
