
import { useState, useEffect } from 'react';
import { SavedActivity, SkillActivity } from '@/data/heartActivities';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { showSuccessToast, showErrorToast } from '@/utils/notifications';
import { 
  getStoredActivities, 
  storeActivities 
} from '@/utils/activityStorage';
import { 
  loadActivitiesFromSources,
  saveActivityToSources,
  toggleActivityCompletionInSources,
  removeActivityFromSources,
  addActivityToHabitTracker
} from '@/services/activityService';

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
      
      // Try to load from all sources
      const activities = await loadActivitiesFromSources(userId);
      if (activities.length > 0) {
        setSavedActivities(activities);
        // Save to localStorage as backup
        storeActivities(activities);
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
      
      // Save the activity to all sources
      const newSavedActivity = await saveActivityToSources(activity, userId);
      
      // If the user wants to add this to the habit tracker
      if (addToHabitTracker) {
        await addActivityToHabitTracker(userId, activity);
        
        showSuccessToast(
          "Habit Created",
          "The activity has been added to your habit tracker"
        );
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
      // Update in all sources
      const updatedActivity = await toggleActivityCompletionInSources(
        savedActivityId, 
        savedActivities
      );
      
      // Update local state
      const updatedSavedActivities = savedActivities.map(activity => {
        if (activity.id === savedActivityId) {
          return updatedActivity;
        }
        return activity;
      });
      
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage
      storeActivities(updatedSavedActivities);
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
      // Remove from all sources
      await removeActivityFromSources(savedActivityId);
      
      // Update local state
      const updatedSavedActivities = savedActivities.filter(
        activity => activity.id !== savedActivityId
      );
      
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage
      storeActivities(updatedSavedActivities);
      
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
