
import { supabase } from '@/integrations/supabase/client';
import { SkillActivity } from '@/data/heartActivities';
import { v4 as uuidv4 } from 'uuid';
import { getHabitsFromLocalStorage, saveHabitsToLocalStorage } from './habitsService';
import { toast } from '@/hooks/use-toast';

// Add activity to habit tracker
export const addActivityToHabitTracker = async (
  userId: string, 
  activity: SkillActivity,
  frequency: 'daily' | 'weekly' | 'monthly' = 'daily'
) => {
  try {
    // Create a habit object
    const habit = {
      id: uuidv4(),
      userId,
      dimension: activity.dimension,
      description: activity.description,
      frequency,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    // Try to save to Supabase
    try {
      // Set the anonymous ID header for RLS
      const headers = { 'x-anonymous-id': userId };
      
      const { data, error } = await supabase
        .from('habits')
        .insert({
          id: habit.id,
          user_id: habit.userId,
          dimension: habit.dimension,
          description: habit.description,
          frequency: habit.frequency,
          completed_dates: habit.completedDates,
          created_at: habit.createdAt
        })
        .select('id')
        .headers(headers)
        .single();
      
      if (error) {
        console.error('Error saving to Supabase:', error);
      } else if (data) {
        habit.id = data.id; // Use the Supabase-generated ID
      }
    } catch (e) {
      console.error('Error saving to Supabase:', e);
    }
    
    // Also save to local storage as a backup
    const existingHabits = getHabitsFromLocalStorage();
    saveHabitsToLocalStorage([...existingHabits, habit]);

    toast({
      title: "Added to Habit Tracker",
      description: `The activity is now in your ${frequency} habits`,
    });

    return true;
  } catch (e) {
    console.error('Error adding to habit tracker:', e);
    toast({
      title: "Error",
      description: "Could not add activity to habit tracker",
      variant: "destructive"
    });
    return false;
  }
};
