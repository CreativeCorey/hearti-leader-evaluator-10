
import React, { createContext, useContext, useState } from 'react';
import { startOfWeek, addDays } from 'date-fns';
import { HEARTIDimension } from '@/types';
import { Habit, useHabits } from '@/hooks/useHabits';
import { filterHabits } from '@/utils/habitUtils';
import { toast } from '@/hooks/use-toast';

interface HabitTrackerContextType {
  habits: Habit[];
  loading: boolean;
  activeDimension: HEARTIDimension | 'all';
  weekDates: Date[];
  filteredHabits: Habit[];
  handleAddHabit: (newHabit: any) => Promise<boolean>;
  toggleHabitCompletion: (habitId: string | undefined, date: Date) => void;
  deleteHabit: (habitId: string | undefined) => void;
  setActiveDimension: (dimension: HEARTIDimension | 'all') => void;
}

const HabitTrackerContext = createContext<HabitTrackerContextType | undefined>(undefined);

export const HabitTrackerProvider: React.FC<{
  children: React.ReactNode;
  focusDimension?: HEARTIDimension;
}> = ({ children, focusDimension }) => {
  // Set up active dimension state
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension | 'all'>(focusDimension || 'all');
  
  // Date tracking
  const [currentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Get week dates for display
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  
  // Use our custom hook for habit functionality
  const { habits, loading, handleAddHabit, toggleHabitCompletion, deleteHabit } = useHabits(focusDimension);
  
  // Filter habits based on active dimension
  const filteredHabits = filterHabits(habits, activeDimension);

  // Create a safe toggle function that checks for valid ID
  const handleToggleHabit = (habitId: string | undefined, date: Date) => {
    if (!habitId) {
      console.error("Cannot toggle habit completion: missing habit ID");
      toast({
        title: "Error",
        description: "Could not update habit completion status",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toggleHabitCompletion(habitId, date);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Habit status updated"
      });
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      toast({
        title: "Error",
        description: "Failed to update habit status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create a safe delete function that checks for valid ID
  const handleDeleteHabit = (habitId: string | undefined) => {
    if (!habitId) {
      console.error("Cannot delete habit: missing habit ID");
      toast({
        title: "Error",
        description: "Could not delete habit",
        variant: "destructive",
      });
      return;
    }
    
    try {
      deleteHabit(habitId);
    } catch (error) {
      console.error("Error deleting habit:", error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    habits,
    loading,
    activeDimension,
    weekDates,
    filteredHabits,
    handleAddHabit,
    toggleHabitCompletion: handleToggleHabit,
    deleteHabit: handleDeleteHabit,
    setActiveDimension
  };

  return (
    <HabitTrackerContext.Provider value={value}>
      {children}
    </HabitTrackerContext.Provider>
  );
};

export const useHabitTracker = () => {
  const context = useContext(HabitTrackerContext);
  if (context === undefined) {
    throw new Error('useHabitTracker must be used within a HabitTrackerProvider');
  }
  return context;
};
