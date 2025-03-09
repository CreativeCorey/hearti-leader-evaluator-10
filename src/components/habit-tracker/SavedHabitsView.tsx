
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Archive, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Habit } from '@/hooks/useHabits';
import { dimensionIcons } from '@/components/results/development/DimensionIcons';

interface SavedHabitsViewProps {
  habits: Habit[];
  onResumeHabit?: (habit: Habit) => void;
}

const SavedHabitsView: React.FC<SavedHabitsViewProps> = ({ habits, onResumeHabit }) => {
  if (habits.length === 0) {
    return (
      <div className="p-4 text-center">
        <Archive className="mx-auto mb-2 text-gray-400" size={24} />
        <p className="text-muted-foreground">No saved habits found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Saved Habits</h4>
        {habits.map((habit, index) => {
          const DimensionIcon = dimensionIcons[habit.dimension];
          const completionCount = habit.completedDates?.length || 0;
          const completionPercentage = Math.min((completionCount / 30) * 100, 100);
          
          return (
            <React.Fragment key={habit.id || index}>
              {index > 0 && <Separator className="my-2" />}
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  {DimensionIcon && <DimensionIcon className="text-muted-foreground" size={16} />}
                  <div>
                    <p className="text-sm font-medium">{habit.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground capitalize">{habit.dimension}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground capitalize">{habit.frequency}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium">
                    {completionCount}
                  </div>
                  {onResumeHabit && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => onResumeHabit(habit)}
                    >
                      <Plus size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default SavedHabitsView;
