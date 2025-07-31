
import { SavedActivity, SkillActivity } from '@/data/heartActivities';
import { supabase } from '@/integrations/supabase/client';

// Fetch saved activities from Supabase using proper auth
export const fetchSavedActivities = async (): Promise<SavedActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_activities')
      .select('*');
    
    if (error) {
      console.log('Error fetching from Supabase:', error);
      return [];
    }
    
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
    return [];
  } catch (e) {
    console.log('Error fetching from Supabase', e);
    return [];
  }
};

// Save an activity to Supabase using proper auth
export const saveActivityToSupabase = async (activity: SkillActivity): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.log('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('saved_activities')
      .insert({
        user_id: userData.user.id,
        activity_id: activity.id,
        dimension: activity.dimension,
        completed: false,
        saved_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.log('Error saving to Supabase:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (e) {
    console.log('Error saving to Supabase', e);
    return null;
  }
};

// Update an activity's completion status in Supabase
export const updateActivityCompletionInSupabase = async (savedActivityId: string, completed: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_activities')
      .update({ completed })
      .eq('id', savedActivityId);
    
    if (error) {
      console.log('Error updating in Supabase:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.log('Error updating in Supabase', e);
    return false;
  }
};

// Delete an activity from Supabase
export const deleteActivityFromSupabase = async (savedActivityId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_activities')
      .delete()
      .eq('id', savedActivityId);
    
    if (error) {
      console.log('Error deleting from Supabase:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.log('Error deleting from Supabase', e);
    return false;
  }
};

// Save a habit to Supabase using proper auth
export const saveHabitToSupabase = async (activity: SkillActivity): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.log('User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('habits')
      .insert({
        user_id: userData.user.id,
        dimension: activity.dimension,
        description: activity.description,
        frequency: 'daily',
        completed_dates: []
      });
    
    if (error) {
      console.log('Error adding to habit tracker:', error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.log('Error adding to habit tracker', e);
    return false;
  }
};
