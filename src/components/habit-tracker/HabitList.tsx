
import React from 'react';
import { Habit } from '@/hooks/useHabits';
import { useIsMobile } from '@/hooks/use-mobile';
import HabitItem from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  weekDates: Date[];
  onToggleHabit: (habitId: string | undefined, date: Date) => void;
  onDeleteHabit: (habitId: string | undefined) => void;
  calculateStreaks: (habit: Habit) => number;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  weekDates,
  onToggleHabit,
  onDeleteHabit,
  calculateStreaks
}) => {
  const isMobile = useIsMobile();
  
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-muted-foreground">No habits found. Click "Add Habit" to create one.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${isMobile ? 'gap-3' : 'gap-4'}`}>
      {habits.map((habit) => {
        const streakCount = calculateStreaks(habit);
        
        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            streakCount={streakCount}
            onToggleHabit={onToggleHabit}
            onDeleteHabit={onDeleteHabit}
          />
        );
      })}
    </div>
  );
};

export default HabitList;
