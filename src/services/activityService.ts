
import { supabase } from '@/integrations/supabase/client';
import { SavedActivity, SkillActivity } from '@/data/heartActivities';
import { v4 as uuidv4 } from 'uuid';
import { getHabitsFromLocalStorage, saveHabitsToLocalStorage } from './habitsService';
import { toast } from '@/hooks/use-toast';

// Create a new saved activity
export const saveActivity = async (
  userId: string,
  activity: SkillActivity,
  addToHabitTracker: boolean = false,
  frequency: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<SavedActivity> => {
  const savedActivity: SavedActivity = {
    id: uuidv4(),
    userId,
    activityId: activity.id,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  // Try to save to Supabase
  try {
    const { data, error } = await supabase
      .from('saved_activities')
      .insert({
        id: savedActivity.id,
        user_id: savedActivity.userId,
        activity_id: savedActivity.activityId,
        completed: savedActivity.completed,
        created_at: savedActivity.createdAt
      })
      .select();

    if (error) {
      console.error('Error saving activity to Supabase:', error);
    }
  } catch (error) {
    console.error('Error saving activity to Supabase:', error);
  }

  // If requested, also add to habit tracker
  if (addToHabitTracker) {
    await addActivityToHabitTracker(userId, activity, frequency);
  }

  return savedActivity;
};

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

    // Add to Supabase
    try {
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
        .select();

      if (error) {
        console.error('Error adding habit to Supabase:', error);
      }
    } catch (error) {
      console.error('Error adding habit to Supabase:', error);
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
    return false;
  }
};

// Get saved activities for user
export const getSavedActivities = async (userId: string): Promise<SavedActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_activities')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching saved activities:', error);
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      activityId: item.activity_id,
      completed: item.completed,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching saved activities:', error);
    return [];
  }
};

// Toggle completion status
export const toggleActivityCompletion = async (
  activityId: string,
  isCompleted: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_activities')
      .update({ completed: isCompleted })
      .eq('id', activityId);

    if (error) {
      console.error('Error updating activity completion:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating activity completion:', error);
    return false;
  }
};

// Remove a saved activity
export const removeSavedActivity = async (activityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_activities')
      .delete()
      .eq('id', activityId);

    if (error) {
      console.error('Error removing saved activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing saved activity:', error);
    return false;
  }
};
