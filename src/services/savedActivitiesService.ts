
import { supabase } from '@/integrations/supabase/client';
import { SavedActivity, SkillActivity } from '@/data/heartActivities';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

// Local storage key
const SAVED_ACTIVITIES_KEY = 'hearti-saved-activities';

// Local storage operations
export const saveActivitiesToLocalStorage = (activities: SavedActivity[]): void => {
  localStorage.setItem(SAVED_ACTIVITIES_KEY, JSON.stringify(activities));
};

export const getActivitiesFromLocalStorage = (): SavedActivity[] => {
  const storedActivities = localStorage.getItem(SAVED_ACTIVITIES_KEY);
  return storedActivities ? JSON.parse(storedActivities) : [];
};

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
    dimension: activity.dimension,
    savedAt: new Date().toISOString(),
  };

  // Log that we would save to Supabase
  console.log('Would save to Supabase if table existed:', savedActivity);
  
  // If requested, also add to habit tracker
  if (addToHabitTracker) {
    await import('./habitTrackerService').then(module => {
      module.addActivityToHabitTracker(userId, activity, frequency);
    });
  }

  // Add to localStorage
  const existingActivities = getActivitiesFromLocalStorage();
  saveActivitiesToLocalStorage([...existingActivities, savedActivity]);

  return savedActivity;
};

// Get saved activities for user
export const getSavedActivities = async (userId: string): Promise<SavedActivity[]> => {
  try {
    // Log that we would fetch from Supabase
    console.log('Would fetch activities for user:', userId);
    
    // Return from localStorage as fallback
    return getActivitiesFromLocalStorage().filter(activity => activity.userId === userId);
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
    console.log('Would toggle activity completion if table existed:', activityId, isCompleted);
    
    // Update in localStorage
    const activities = getActivitiesFromLocalStorage();
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        return { ...activity, completed: isCompleted };
      }
      return activity;
    });
    
    saveActivitiesToLocalStorage(updatedActivities);
    return true;
  } catch (error) {
    console.error('Error updating activity completion:', error);
    return false;
  }
};

// Remove a saved activity
export const removeSavedActivity = async (activityId: string): Promise<boolean> => {
  try {
    console.log('Would remove activity if table existed:', activityId);
    
    // Remove from localStorage
    const activities = getActivitiesFromLocalStorage();
    const updatedActivities = activities.filter(activity => activity.id !== activityId);
    
    saveActivitiesToLocalStorage(updatedActivities);
    return true;
  } catch (error) {
    console.error('Error removing saved activity:', error);
    return false;
  }
};
