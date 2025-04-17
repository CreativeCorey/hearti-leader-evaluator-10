
import React from 'react';
import { Habit } from '@/types';
import HabitItem from './HabitItem';
import EmptyHabitState from './EmptyHabitState';

interface HabitListProps {
  habits: Habit[];
  isLoading: boolean;
  onComplete: (habitId: string) => void;
  onSkip: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  filter?: 'all' | 'daily' | 'weekly' | 'monthly';
  showCompleted?: boolean;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  isLoading,
  onComplete,
  onSkip,
  onDelete,
  filter = 'all',
  showCompleted = true
}) => {
  if (isLoading) {
    return <div className="py-4 flex justify-center">Loading habits...</div>;
  }

  if (habits.length === 0) {
    return <EmptyHabitState />;
  }

  const filteredHabits = habits.filter((habit) => {
    // Filter by frequency
    if (filter !== 'all' && habit.frequency !== filter) {
      return false;
    }

    // Convert imported habits to match our type definition requirements
    // This ensures all required properties are present
    const validHabit: Habit = {
      id: habit.id || '',  // Provide default if missing
      description: habit.description,
      dimension: habit.dimension,
      frequency: habit.frequency,
      completedDates: habit.completedDates || [],
      skippedDates: habit.skippedDates || [],
      userId: habit.userId,
      createdAt: habit.createdAt
    };

    return validHabit.id !== '';
  });

  if (filteredHabits.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        No {filter !== 'all' ? filter : ''} habits found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredHabits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggleComplete={onComplete}
          onSkipToday={onSkip}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default HabitList;
