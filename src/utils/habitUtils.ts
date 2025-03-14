
import { parseISO, isToday, differenceInCalendarDays, isBefore, isAfter, format } from 'date-fns';
import { Habit } from '@/hooks/useHabits';
import { HEARTIDimension } from '@/types';
import { completionGoals } from '@/constants/habitGoals';

// Filter habits based on active dimension
export const filterHabits = (habits: Habit[], activeDimension: HEARTIDimension | 'all') => {
  return habits.filter(habit => 
    activeDimension === 'all' || habit.dimension === activeDimension
  );
};

// Calculate streaks for a habit
export const calculateStreaks = (habit: Habit) => {
  if (habit.completedDates.length === 0) return 0;
  
  // Convert string dates to Date objects and sort chronologically
  const dates = habit.completedDates
    .map(dateStr => parseISO(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());
  
  // Handle current streak calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  let currentStreak = 0;
  let maxStreak = 0;
  let lastDate = null;
  
  // Check if the most recent date is today or yesterday to determine if streak is active
  const mostRecentDate = dates[dates.length - 1];
  const isStreakActive = isToday(mostRecentDate) || 
                         differenceInCalendarDays(today, mostRecentDate) === 1;
  
  // Process dates to find streaks
  for (let i = 0; i < dates.length; i++) {
    const currentDate = dates[i];
    
    if (lastDate === null) {
      // First date in streak
      currentStreak = 1;
      lastDate = currentDate;
    } else {
      // Check if this date is consecutive to the last one
      const dayDifference = differenceInCalendarDays(currentDate, lastDate);
      
      if (dayDifference === 1) {
        // Consecutive day, continue streak
        currentStreak++;
      } else if (dayDifference > 1) {
        // Gap in dates, reset streak
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
      // else dayDifference === 0, same day logged multiple times, ignore
      
      lastDate = currentDate;
    }
  }
  
  // Update max streak with final current streak value
  maxStreak = Math.max(maxStreak, currentStreak);
  
  // If streak is not active (no completion today or yesterday), 
  // return max historical streak
  if (!isStreakActive) {
    return maxStreak;
  }
  
  return currentStreak;
};

// Calculate mastery percentage based on completed dates and frequency
export const calculateMasteryPercentage = (habit: Habit) => {
  const completedCount = habit.completedDates.length;
  const goal = completionGoals[habit.frequency];
  
  return Math.min(Math.round((completedCount / goal) * 100), 100);
};

// Determine if a habit has reached mastery
export const hasMastery = (habit: Habit) => {
  return habit.completedDates.length >= completionGoals[habit.frequency];
};
