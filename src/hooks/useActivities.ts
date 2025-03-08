
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { SavedActivity, SkillActivity } from '@/data/heartActivities';

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
      const storedActivities = localStorage.getItem('hearti-saved-activities');
      if (storedActivities) {
        setSavedActivities(JSON.parse(storedActivities));
      }
      
    } catch (error) {
      console.error('Error loading saved activities:', error);
      toast({
        title: "Error",
        description: "Could not load your saved activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveActivity = async (activity: SkillActivity) => {
    try {
      const userId = getOrCreateAnonymousId();
      
      // Check if already saved
      if (savedActivities.some(saved => saved.activityId === activity.id)) {
        toast({
          title: "Already Saved",
          description: "This activity is already in your saved list",
        });
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
      
      // Update local state
      const updatedSavedActivities = [...savedActivities, newSavedActivity];
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage as backup
      localStorage.setItem('hearti-saved-activities', JSON.stringify(updatedSavedActivities));
      
      toast({
        title: "Activity Saved",
        description: "The activity has been added to your saved list",
      });
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Error",
        description: "Could not save the activity",
        variant: "destructive",
      });
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
      localStorage.setItem('hearti-saved-activities', JSON.stringify(updatedSavedActivities));
      
    } catch (error) {
      console.error('Error toggling activity completion:', error);
      toast({
        title: "Error",
        description: "Could not update the activity",
        variant: "destructive",
      });
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
      localStorage.setItem('hearti-saved-activities', JSON.stringify(updatedSavedActivities));
      
      toast({
        title: "Activity Removed",
        description: "The activity has been removed from your saved list",
      });
    } catch (error) {
      console.error('Error removing saved activity:', error);
      toast({
        title: "Error",
        description: "Could not remove the activity",
        variant: "destructive",
      });
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
