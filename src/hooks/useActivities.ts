
import { useState, useEffect } from 'react';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
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
import { 
  showSuccessToast, 
  showErrorToast 
} from '@/utils/notifications';

export const useActivities = () => {
  const [savedActivities, setSavedActivities] = useState<SavedActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedActivities();
  }, []);

  const loadSavedActivities = async () => {
    try {
      setLoading(true);
      
      // Get current user ID
      const userId = getOrCreateAnonymousId();
      
      // Try to load from localStorage first
      const storedActivities = getStoredActivities();
      if (storedActivities.length > 0) {
        setSavedActivities(storedActivities);
      }
      
      // Try to fetch from Supabase
      try {
        const supabaseActivities = await fetchSavedActivities(userId);
        
        if (supabaseActivities.length > 0) {
          setSavedActivities(supabaseActivities);
          // Save to localStorage as backup
          storeActivities(supabaseActivities);
        }
      } catch (e) {
        console.log('Error fetching from Supabase, using local storage', e);
      }
    } catch (error) {
      console.error('Error loading saved activities:', error);
      showErrorToast(
        "Error", 
        "Could not load your saved activities"
      );
    } finally {
      setLoading(false);
    }
  };
  
  const saveActivity = async (activity: SkillActivity, addToHabitTracker: boolean = false) => {
    try {
      const userId = getOrCreateAnonymousId();
      
      // Check if already saved
      if (savedActivities.some(saved => saved.activityId === activity.id)) {
        showSuccessToast(
          "Already Saved", 
          "This activity is already in your saved list"
        );
        return;
      }
      
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
      
      // If the user wants to add this to the habit tracker
      if (addToHabitTracker) {
        try {
          // Save to local storage
          storeNewHabit(userId, activity.dimension, activity.description);
          
          // Add to Supabase habits table
          await saveHabitToSupabase(userId, activity);
          
          showSuccessToast(
            "Habit Created",
            "The activity has been added to your habit tracker"
          );
        } catch (e) {
          console.log('Error adding to habit tracker', e);
        }
      }
      
      // Update local state
      const updatedSavedActivities = [...savedActivities, newSavedActivity];
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage as backup
      storeActivities(updatedSavedActivities);
      
      showSuccessToast(
        "Activity Saved",
        "The activity has been added to your saved list"
      );
    } catch (error) {
      console.error('Error saving activity:', error);
      showErrorToast(
        "Error",
        "Could not save the activity"
      );
    }
  };
  
  const toggleActivityCompletion = async (savedActivityId: string | undefined) => {
    if (!savedActivityId) return;
    
    try {
      // Update local state
      const updatedSavedActivities = savedActivities.map(activity => {
        if (activity.id === savedActivityId) {
          return { ...activity, completed: !activity.completed };
        }
        return activity;
      });
      
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage
      storeActivities(updatedSavedActivities);
      
      // Try to update in Supabase
      const activityToUpdate = updatedSavedActivities.find(a => a.id === savedActivityId);
      
      if (activityToUpdate) {
        try {
          await updateActivityCompletionInSupabase(savedActivityId, activityToUpdate.completed);
        } catch (e) {
          console.log('Error updating in Supabase, updated in local storage only', e);
        }
      }
    } catch (error) {
      console.error('Error toggling activity completion:', error);
      showErrorToast(
        "Error",
        "Could not update the activity"
      );
    }
  };
  
  const removeSavedActivity = async (savedActivityId: string | undefined) => {
    if (!savedActivityId) return;
    
    try {
      // Update local state
      const updatedSavedActivities = savedActivities.filter(
        activity => activity.id !== savedActivityId
      );
      
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage
      storeActivities(updatedSavedActivities);
      
      // Try to delete from Supabase
      try {
        await deleteActivityFromSupabase(savedActivityId);
      } catch (e) {
        console.log('Error deleting from Supabase, removed from local storage only', e);
      }
      
      showSuccessToast(
        "Activity Removed",
        "The activity has been removed from your saved list"
      );
    } catch (error) {
      console.error('Error removing saved activity:', error);
      showErrorToast(
        "Error",
        "Could not remove the activity"
      );
    }
  };

  return { 
    savedActivities, 
    loading, 
    saveActivity, 
    toggleActivityCompletion, 
    removeSavedActivity 
  };
};
