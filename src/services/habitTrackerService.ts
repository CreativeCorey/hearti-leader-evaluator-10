
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

    // Log that we would save to Supabase
    console.log('Would save habit to Supabase if table existed:', habit);
    
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
    return false;
  }
};
