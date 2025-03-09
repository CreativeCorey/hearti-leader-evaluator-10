
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { HEARTIDimension } from '@/types';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { Habit, NewHabitForm } from '@/types/habits';
import { v4 as uuidv4 } from 'uuid';
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
  const userId = getOrCreateAnonymousId();
  
  useEffect(() => {
    loadHabits();
  }, []);
  
  const loadHabits = async () => {
    try {
      setLoading(true);
      
      // Fetch habits from local storage initially
      const localHabits = getHabitsFromLocalStorage();
      if (localHabits.length > 0) {
        // Ensure all habits have IDs
        const validatedHabits = localHabits.map(habit => {
          if (!habit.id) {
            // Add a UUID if missing
            return { ...habit, id: uuidv4() };
          }
          return habit;
        });
        setHabits(validatedHabits);
        saveHabitsToLocalStorage(validatedHabits);
      }
      
      // Try to fetch from Supabase if available
      try {
        const supabaseHabits = await fetchHabitsFromSupabase(userId);
        
        if (supabaseHabits.length > 0) {
          // Ensure all habits have IDs
          const validatedHabits = supabaseHabits.map(habit => {
            if (!habit.id) {
              // Add a UUID if missing
              return { ...habit, id: uuidv4() };
            }
            return habit;
          });
          setHabits(validatedHabits);
          // Save to local storage as backup
          saveHabitsToLocalStorage(validatedHabits);
        }
      } catch (e) {
        console.error('Error fetching from Supabase, using local storage', e);
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
      console.error('Error saving to Supabase, saved to local storage only', e);
    }
  };
  
  const handleAddHabit = async (newHabitForm: NewHabitForm) => {
    // Check if we've reached the limit of 5 habits
    if (habits.length >= 5) {
      toast({
        title: "Habit limit reached",
        description: "You can track up to 5 habits at a time. Please delete an existing habit to add a new one.",
        variant: "destructive",
      });
      return false;
    }
    
    const habit = await createNewHabit(newHabitForm);
    
    if (!habit) return false;
    
    const updatedHabits = [...habits, habit];
    setHabits(updatedHabits);
    saveHabitsToLocalStorage(updatedHabits);
    
    toast({
      title: "Habit added",
      description: `Your new ${newHabitForm.frequency} habit has been created`,
    });
    
    return true;
  };
  
  const toggleHabitCompletion = (habitId: string, date: Date) => {
    if (!habitId) {
      console.error('Cannot toggle habit: missing habitId');
      return;
    }
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completedDates.includes(dateStr);
        
        const updatedHabit = {
          ...habit,
          completedDates: wasCompleted
            ? habit.completedDates.filter(d => d !== dateStr)
            : [...habit.completedDates, dateStr]
        };
        
        // Try to update in Supabase
        updateHabitInSupabase(updatedHabit).catch(e => 
          console.error('Error updating habit completion in Supabase', e)
        );
        
        return updatedHabit;
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveHabitsToLocalStorage(updatedHabits);
  };
  
  const deleteHabit = async (habitId: string) => {
    if (!habitId) {
      console.error('Cannot delete habit: missing habitId');
      return;
    }
    
    try {
      // Try to delete from Supabase
      await deleteHabitFromSupabase(habitId, userId);
      
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
      
      // Even if Supabase fails, still remove from local state
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      setHabits(updatedHabits);
      saveHabitsToLocalStorage(updatedHabits);
      
      toast({
        title: "Habit deleted locally",
        description: "The habit could not be deleted from the server but was removed locally",
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
