
import React from 'react';
import { Habit } from '@/hooks/useHabits';
import HabitItem from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  weekDates: Date[];
  onToggleHabit: (habitId: string, date: Date) => void;
  onDeleteHabit: (habitId: string) => void;
  calculateStreaks: (habit: Habit) => number;
  completionGoals?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  weekDates,
  onToggleHabit,
  onDeleteHabit,
  calculateStreaks,
  completionGoals
}) => {
  return (
    <div className="space-y-4 mt-4">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          weekDates={weekDates}
          onToggleCompletion={(date) => habit.id && onToggleHabit(habit.id, date)}
          onDelete={() => habit.id && onDeleteHabit(habit.id)}
          streak={calculateStreaks(habit)}
          completionGoals={completionGoals}
        />
      ))}
    </div>
  );
};

export default HabitList;
