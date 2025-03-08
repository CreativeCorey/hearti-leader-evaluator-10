
import { SavedActivity, SkillActivity } from '@/data/heartActivities';
import { 
  fetchSavedActivities, 
  saveActivityToSupabase, 
  updateActivityCompletionInSupabase, 
  deleteActivityFromSupabase,
  saveHabitToSupabase
} from '@/api/savedActivitiesApi';
import { 
  getStoredActivities, 
  storeActivities, 
  storeNewHabit 
} from '@/utils/activityStorage';

/**
 * Load activities from all available sources (Supabase and localStorage)
 */
export const loadActivitiesFromSources = async (userId: string): Promise<SavedActivity[]> => {
  try {
    const supabaseActivities = await fetchSavedActivities(userId);
    return supabaseActivities;
  } catch (e) {
    console.log('Error fetching from Supabase, using local storage', e);
    return getStoredActivities();
  }
};

/**
 * Save an activity to all available sources
 */
export const saveActivityToSources = async (
  activity: SkillActivity, 
  userId: string
): Promise<SavedActivity> => {
  const newSavedActivity: SavedActivity = {
    id: crypto.randomUUID(),
    userId,
    activityId: activity.id,
    dimension: activity.dimension,
    completed: false,
    savedAt: new Date().toISOString()
  };
  
  // Try to save to Supabase
  try {
    const savedId = await saveActivityToSupabase(activity, userId);
    if (savedId) {
      newSavedActivity.id = savedId;
    }
  } catch (e) {
    console.log('Error saving to Supabase, will save to local storage only', e);
  }
  
  return newSavedActivity;
};

/**
 * Toggle the completion status of an activity in all sources
 */
export const toggleActivityCompletionInSources = async (
  savedActivityId: string,
  savedActivities: SavedActivity[]
): Promise<SavedActivity> => {
  // Find the activity to update
  const activityToUpdate = savedActivities.find(a => a.id === savedActivityId);
  
  if (!activityToUpdate) {
    throw new Error('Activity not found');
  }
  
  // Toggle the completed status
  const updatedActivity = { 
    ...activityToUpdate, 
    completed: !activityToUpdate.completed 
  };
  
  // Try to update in Supabase
  try {
    await updateActivityCompletionInSupabase(savedActivityId, updatedActivity.completed);
  } catch (e) {
    console.log('Error updating in Supabase, updated in local storage only', e);
  }
  
  return updatedActivity;
};

/**
 * Remove an activity from all sources
 */
export const removeActivityFromSources = async (savedActivityId: string): Promise<void> => {
  // Try to delete from Supabase
  try {
    await deleteActivityFromSupabase(savedActivityId);
  } catch (e) {
    console.log('Error deleting from Supabase, removed from local storage only', e);
  }
};

/**
 * Add an activity to the habit tracker
 */
export const addActivityToHabitTracker = async (
  userId: string,
  activity: SkillActivity
): Promise<void> => {
  try {
    // Save to local storage
    storeNewHabit(userId, activity.dimension, activity.description);
    
    // Add to Supabase habits table
    await saveHabitToSupabase(userId, activity);
  } catch (e) {
    console.log('Error adding to habit tracker', e);
    throw new Error('Failed to add activity to habit tracker');
  }
};
