
import { SavedActivity } from '@/data/heartActivities';

const SAVED_ACTIVITIES_KEY = 'hearti-saved-activities';
const HABITS_KEY = 'hearti-habits';

// Get saved activities from localStorage
export const getStoredActivities = (): SavedActivity[] => {
  const storedActivities = localStorage.getItem(SAVED_ACTIVITIES_KEY);
  return storedActivities ? JSON.parse(storedActivities) : [];
};

// Save activities to localStorage
export const storeActivities = (activities: SavedActivity[]): void => {
  localStorage.setItem(SAVED_ACTIVITIES_KEY, JSON.stringify(activities));
};

// Get habits from localStorage
export const getStoredHabits = (): any[] => {
  const storedHabits = localStorage.getItem(HABITS_KEY);
  return storedHabits ? JSON.parse(storedHabits) : [];
};

// Save habits to localStorage
export const storeHabits = (habits: any[]): void => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

// Store a new habit in localStorage
export const storeNewHabit = (userId: string, dimension: string, description: string): void => {
  const habits = getStoredHabits();
  
  const newHabit = {
    id: crypto.randomUUID(),
    userId,
    dimension,
    description,
    frequency: 'daily',
    completedDates: [],
    createdAt: new Date().toISOString()
  };
  
  // Add to local storage
  const updatedHabits = [...habits, newHabit];
  storeHabits(updatedHabits);
};
