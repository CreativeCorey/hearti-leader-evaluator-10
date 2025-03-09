import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Habit, NewHabitForm } from '@/types/habits';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Fetch habits from Supabase
export const fetchHabitsFromSupabase = async (userId: string): Promise<Habit[]> => {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching habits from Supabase:', error);
      return [];
    }
    
    if (data && data.length > 0) {
      // Transform data to match our Habit interface
      return data.map((habit: any) => ({
        id: habit.id,
        userId: habit.user_id,
        dimension: habit.dimension,
        description: habit.description,
        frequency: habit.frequency || 'daily', // Ensure backward compatibility
        completedDates: Array.isArray(habit.completed_dates) ? habit.completed_dates : [],
        createdAt: habit.created_at
      }));
    }
    
    return [];
  } catch (e) {
    console.log('Error fetching from Supabase', e);
    return [];
  }
};

// Save a habit to Supabase
export const saveHabitToSupabase = async (habit: Habit): Promise<string | undefined> => {
  try {
    // Set the anonymous ID header for RLS
    const headers = { 'x-anonymous-id': habit.userId };
    
    const { data, error } = await supabase
      .from('habits')
      .insert({
        id: habit.id,  // Use the pre-generated UUID
        user_id: habit.userId,
        dimension: habit.dimension,
        description: habit.description,
        frequency: habit.frequency,
        completed_dates: habit.completedDates,
        created_at: habit.createdAt
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error saving habit to Supabase:', error);
      return undefined;
    }
    
    return data?.id;
  } catch (e) {
    console.error('Error saving to Supabase', e);
    return undefined;
  }
};

// Update a habit in Supabase
export const updateHabitInSupabase = async (habit: Habit): Promise<boolean> => {
  if (!habit.id) return false;
  
  try {
    // Set the anonymous ID header for RLS
    const headers = { 'x-anonymous-id': habit.userId };
    
    const { error } = await supabase
      .from('habits')
      .update({
        user_id: habit.userId,
        dimension: habit.dimension,
        description: habit.description,
        frequency: habit.frequency,
        completed_dates: habit.completedDates
      })
      .eq('id', habit.id);
    
    if (error) {
      console.error('Error updating habit in Supabase:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Error updating in Supabase', e);
    return false;
  }
};

// Delete a habit from Supabase
export const deleteHabitFromSupabase = async (habitId: string, userId: string): Promise<boolean> => {
  try {
    // Set the anonymous ID header for RLS
    const headers = { 'x-anonymous-id': userId };
    
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);
    
    if (error) {
      console.error('Error deleting habit from Supabase:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Error deleting from Supabase', e);
    return false;
  }
};

// Local storage operations
export const saveHabitsToLocalStorage = (habits: Habit[]): void => {
  localStorage.setItem('hearti-habits', JSON.stringify(habits));
};

export const getHabitsFromLocalStorage = (): Habit[] => {
  const storedHabits = localStorage.getItem('hearti-habits');
  return storedHabits ? JSON.parse(storedHabits) : [];
};

// Create a new habit
export const createNewHabit = async (newHabit: NewHabitForm): Promise<Habit | null> => {
  if (!newHabit.description) {
    toast({
      title: "Missing information",
      description: "Please enter a habit description",
      variant: "destructive",
    });
    return null;
  }
  
  const userId = getOrCreateAnonymousId();
  
  // Generate a UUID for the new habit first
  const generatedId = uuidv4();
  
  const habit: Habit = {
    id: generatedId, // Always set an ID
    userId,
    dimension: newHabit.dimension,
    description: newHabit.description,
    frequency: newHabit.frequency,
    completedDates: [],
    createdAt: new Date().toISOString(),
  };
  
  try {
    const habitId = await saveHabitToSupabase(habit);
    if (habitId) {
      habit.id = habitId; // Replace with Supabase ID if available
    }
    // If Supabase fails, we'll keep the UUID we generated
    return habit;
  } catch (e) {
    console.log('Error creating habit', e);
    return habit; // Still return the habit with the generated ID for local storage
  }
};
