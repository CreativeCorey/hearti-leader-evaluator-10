
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { HEARTIDimension } from '@/types';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { Habit, NewHabitForm } from '@/types/habits';
import {
  fetchHabitsFromSupabase,
  saveHabitsToLocalStorage,
  getHabitsFromLocalStorage,
  createNewHabit,
  updateHabitInSupabase,
  deleteHabitFromSupabase
} from '@/services/habitsService';

export type { Habit, NewHabitForm };

export const useHabits = (focusDimension?: HEARTIDimension) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadHabits();
  }, []);
  
  const loadHabits = async () => {
    try {
      setLoading(true);
      
      // Get the current user ID
      const userId = getOrCreateAnonymousId();
      
      // Fetch habits from local storage initially
      const localHabits = getHabitsFromLocalStorage();
      if (localHabits.length > 0) {
        setHabits(localHabits);
      }
      
      // Try to fetch from Supabase if available
      try {
        const supabaseHabits = await fetchHabitsFromSupabase(userId);
        
        if (supabaseHabits.length > 0) {
          setHabits(supabaseHabits);
          // Save to local storage as backup
          saveHabitsToLocalStorage(supabaseHabits);
        }
      } catch (e) {
        console.log('Error fetching from Supabase, using local storage', e);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Error",
        description: "Could not load your habits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveHabits = async (updatedHabits: Habit[]) => {
    // Save to local storage
    saveHabitsToLocalStorage(updatedHabits);
    
    // Try to save to Supabase if available
    try {
      // For each habit, upsert to Supabase
      for (const habit of updatedHabits) {
        if (!habit.id) continue; // Skip new habits that don't have an ID yet
        await updateHabitInSupabase(habit);
      }
    } catch (e) {
      console.log('Error saving to Supabase, saved to local storage only', e);
    }
  };
  
  const handleAddHabit = async (newHabitForm: NewHabitForm) => {
    const habit = await createNewHabit(newHabitForm);
    
    if (!habit) return false;
    
    const updatedHabits = [...habits, habit];
    setHabits(updatedHabits);
    saveHabitsToLocalStorage(updatedHabits);
    
    toast({
      title: "Habit added",
      description: "Your new habit has been created",
    });
    
    return true;
  };
  
  const toggleHabitCompletion = (habitId: string | undefined, date: Date) => {
    if (!habitId) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completedDates.includes(dateStr);
        
        return {
          ...habit,
          completedDates: wasCompleted
            ? habit.completedDates.filter(d => d !== dateStr)
            : [...habit.completedDates, dateStr]
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };
  
  const deleteHabit = async (habitId: string | undefined) => {
    if (!habitId) return;
    
    try {
      // Try to delete from Supabase
      try {
        await deleteHabitFromSupabase(habitId);
      } catch (e) {
        console.log('Error deleting from Supabase', e);
      }
      
      // Remove from local state
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      setHabits(updatedHabits);
      saveHabitsToLocalStorage(updatedHabits);
      
      toast({
        title: "Habit deleted",
        description: "The habit has been removed",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Could not delete the habit",
        variant: "destructive",
      });
    }
  };
  
  return {
    habits,
    loading,
    handleAddHabit,
    toggleHabitCompletion,
    deleteHabit
  };
};
