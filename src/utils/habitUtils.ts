
import { parseISO } from 'date-fns';
import { Habit } from '@/hooks/useHabits';
import { HEARTIDimension } from '@/types';

// Filter habits based on active dimension
export const filterHabits = (habits: Habit[], activeDimension: HEARTIDimension | 'all') => {
  return habits.filter(habit => 
    activeDimension === 'all' || habit.dimension === activeDimension
  );
};

// Calculate streaks for a habit
export const calculateStreaks = (habit: Habit) => {
  if (habit.completedDates.length === 0) return 0;
  
  // Sort dates in ascending order
  const sortedDates = [...habit.completedDates].sort();
  let currentStreak = 1;
  let maxStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = parseISO(sortedDates[i]);
    const prevDate = parseISO(sortedDates[i-1]);
    const diffDays = Math.abs((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
};
