
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { SavedActivity, SkillActivity } from '@/data/heartActivities';

const SUPABASE_URL = 'https://odwkgxdkjyccnkydxvjw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8';

// Fetch saved activities from Supabase
export const fetchSavedActivities = async (userId: string): Promise<SavedActivity[]> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_activities?user_id=eq.${userId}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Transform data to match our SavedActivity interface
        return data.map((activity: any) => ({
          id: activity.id,
          userId: activity.user_id,
          activityId: activity.activity_id,
          dimension: activity.dimension,
          completed: activity.completed,
          savedAt: activity.saved_at
        }));
      }
    }
    return [];
  } catch (e) {
    console.log('Error fetching from Supabase', e);
    return [];
  }
};

// Save an activity to Supabase
export const saveActivityToSupabase = async (activity: SkillActivity, userId: string): Promise<string | null> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_activities`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: userId,
        activity_id: activity.id,
        dimension: activity.dimension,
        completed: false,
        saved_at: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].id;
      }
    }
    return null;
  } catch (e) {
    console.log('Error saving to Supabase', e);
    return null;
  }
};

// Update an activity's completion status in Supabase
export const updateActivityCompletionInSupabase = async (savedActivityId: string, completed: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_activities?id=eq.${savedActivityId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed
      })
    });
    
    return response.ok;
  } catch (e) {
    console.log('Error updating in Supabase', e);
    return false;
  }
};

// Delete an activity from Supabase
export const deleteActivityFromSupabase = async (savedActivityId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_activities?id=eq.${savedActivityId}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY
      }
    });
    
    return response.ok;
  } catch (e) {
    console.log('Error deleting from Supabase', e);
    return false;
  }
};

// Save a habit to Supabase
export const saveHabitToSupabase = async (
  userId: string, 
  activity: SkillActivity
): Promise<boolean> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/habits`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        dimension: activity.dimension,
        description: activity.description,
        frequency: 'daily',
        completed_dates: []
      })
    });
    
    return response.ok;
  } catch (e) {
    console.log('Error adding to habit tracker', e);
    return false;
  }
};
