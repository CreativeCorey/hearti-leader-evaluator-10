
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { SavedActivity, SkillActivity } from '@/data/heartActivities';

// Using a type assertion to allow accessing the 'habits' table that exists in the database
// but not in TypeScript types
const supabaseAny = (window as any).supabase;

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
      
      // Try to fetch from Supabase if available
      try {
        // Use direct fetch to bypass TypeScript issues for now
        const response = await fetch('https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/saved_activities?user_id=eq.' + userId, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            // Transform data to match our SavedActivity interface
            const formattedActivities = data.map((activity: any) => ({
              id: activity.id,
              userId: activity.user_id,
              activityId: activity.activity_id,
              dimension: activity.dimension,
              completed: activity.completed,
              savedAt: activity.saved_at
            }));
            
            setSavedActivities(formattedActivities);
            // Save to localStorage as backup
            localStorage.setItem('hearti-saved-activities', JSON.stringify(formattedActivities));
          }
        }
      } catch (e) {
        console.log('Error fetching from Supabase, using local storage', e);
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
  
  const saveActivity = async (activity: SkillActivity, addToHabitTracker: boolean = false) => {
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
      
      // Try to save to Supabase first
      try {
        // Use direct fetch to bypass TypeScript issues for now
        const response = await fetch('https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/saved_activities', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            user_id: userId,
            activity_id: activity.id,
            dimension: activity.dimension,
            completed: false,
            saved_at: newSavedActivity.savedAt
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            newSavedActivity.id = data[0].id;
          }
        }
      } catch (e) {
        console.log('Error saving to Supabase, will save to local storage only', e);
      }
      
      // If the user wants to add this to the habit tracker
      if (addToHabitTracker) {
        try {
          // Add to habits table
          await fetch('https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/habits', {
            method: 'POST',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: userId,
              dimension: activity.dimension,
              description: activity.description,
              frequency: 'daily', // Default to daily
              completed_dates: []
            })
          });
          
          toast({
            title: "Habit Created",
            description: "The activity has been added to your habit tracker",
          });
        } catch (e) {
          console.log('Error adding to habit tracker', e);
        }
      }
      
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
      
      // Try to update in Supabase
      const activityToUpdate = updatedSavedActivities.find(a => a.id === savedActivityId);
      
      if (activityToUpdate) {
        try {
          // Use direct fetch to bypass TypeScript issues
          await fetch(`https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/saved_activities?id=eq.${savedActivityId}`, {
            method: 'PATCH',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              completed: activityToUpdate.completed
            })
          });
        } catch (e) {
          console.log('Error updating in Supabase, updated in local storage only', e);
        }
      }
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
      
      // Try to delete from Supabase
      try {
        // Use direct fetch to bypass TypeScript issues
        await fetch(`https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/saved_activities?id=eq.${savedActivityId}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8'
          }
        });
      } catch (e) {
        console.log('Error deleting from Supabase, removed from local storage only', e);
      }
      
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
