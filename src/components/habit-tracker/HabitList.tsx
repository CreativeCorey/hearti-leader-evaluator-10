
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { Habit } from '@/hooks/useHabits';

interface HabitListProps {
  habits: Habit[];
  weekDates: Date[];
  onToggleHabit: (habitId: string | undefined, date: Date) => void;
  onDeleteHabit: (habitId: string | undefined) => void;
  calculateStreaks: (habit: Habit) => number;
}

const dimensionColors = {
  humility: 'bg-purple-100 text-purple-800 border-purple-200',
  empathy: 'bg-blue-100 text-blue-800 border-blue-200',
  accountability: 'bg-green-100 text-green-800 border-green-200',
  resiliency: 'bg-amber-100 text-amber-800 border-amber-200',
  transparency: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  inclusivity: 'bg-rose-100 text-rose-800 border-rose-200'
};

const HabitList: React.FC<HabitListProps> = ({
  habits,
  weekDates,
  onToggleHabit,
  onDeleteHabit,
  calculateStreaks
}) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No habits found. Click "Add Habit" to create one.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-7 gap-2 mb-2">
        <div className="font-medium text-sm text-muted-foreground">Habit</div>
        {weekDates.map((date, i) => (
          <div 
            key={i} 
            className={`text-center text-sm font-medium ${
              isSameDay(date, new Date()) ? 'text-indigo-600' : 'text-muted-foreground'
            }`}
          >
            <div>{format(date, 'EEE')}</div>
            <div>{format(date, 'd')}</div>
          </div>
        ))}
      </div>
      
      {habits.map((habit) => (
        <div key={habit.id} className="grid grid-cols-7 gap-2 items-center py-3 border-t">
          <div className="flex flex-col">
            <div className="flex items-start">
              <Badge className={`${dimensionColors[habit.dimension]} font-normal mr-2`}>
                {habit.dimension.substring(0, 3)}
              </Badge>
              <span className="text-sm">{habit.description}</span>
            </div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span className="mr-2">{habit.frequency === 'daily' ? 'Daily' : 'Weekly'}</span>
              <span className="mr-1">•</span>
              <span>Streak: {calculateStreaks(habit)}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 ml-2" 
                onClick={() => onDeleteHabit(habit.id)}
              >
                <X size={12} />
              </Button>
            </div>
          </div>
          
          {weekDates.map((date, i) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isCompleted = habit.completedDates.includes(dateStr);
            
            return (
              <div key={i} className="flex justify-center">
                <Checkbox 
                  checked={isCompleted}
                  onCheckedChange={() => onToggleHabit(habit.id, date)}
                  className={isCompleted ? 'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500' : ''}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HabitList;
