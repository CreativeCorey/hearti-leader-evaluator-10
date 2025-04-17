import { supabase } from '../../integrations/supabase/client';
import { UserProfile } from '../../types';

// Helper function to ensure a user profile exists in Supabase
export const ensureUserProfileExists = async (userId: string): Promise<boolean> => {
  try {
    // Check if the profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error checking user profile:', fetchError);
      return false;
    }
    
    // If profile exists, return true
    if (existingProfile) return true;
    
    // We need to store a reference to this anonymous user ID
    // Since we can't directly insert into auth.users, we'll just
    // use a fallback approach with localStorage instead of
    // trying to create the profile in Supabase
    
    console.log('Profile does not exist in Supabase, using localStorage fallback');
    return false;
  } catch (error) {
    console.error('Failed to ensure user profile exists:', error);
    return false;
  }
};

// User Management with Supabase
export const saveUserProfileToSupabase = async (profile: UserProfile): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        name: profile.name || null,
        email: profile.email || null,
        organization_id: profile.organizationId || null,
        role: (profile.role || 'user') as 'user' | 'admin'
      });

    if (error) {
      console.error('Error saving user profile to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save user profile to Supabase:', error);
    return false;
  }
};

export const getUserProfileFromSupabase = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Transform the data structure from Supabase format to application format
    return {
      id: data.id,
      createdAt: data.created_at,
      name: data.name || undefined,
      email: data.email || undefined,
      organizationId: data.organization_id || undefined,
      role: data.role || 'user'
    };
  } catch (error) {
    console.error('Failed to get user profile from Supabase:', error);
    return null;
  }
};
