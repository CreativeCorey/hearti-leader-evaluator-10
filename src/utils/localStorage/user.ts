import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '../../types';
import { ensureUserProfileExists } from '../supabase/profiles';
import { ANONYMOUS_ID_KEY, PROFILE_KEY } from './constants';
import { getUseSupabase } from './settings';
import { supabase } from '../../integrations/supabase/client';

// User ID Management
export const getOrCreateAnonymousId = (): string => {
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  }
  
  return anonymousId;
};

export const ensureUserExists = async (): Promise<{ id: string, organizationId?: string }> => {
  // First check if user is authenticated with Supabase
  const { data: { session } } = await supabase.auth.getSession();
  
  let userId: string;
  let organizationId: string | undefined;
  
  if (session?.user) {
    // Use authenticated user ID
    userId = session.user.id;
    console.log('Using authenticated user ID:', userId);
    
    // Get organization ID from user profile if it exists
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userId)
        .maybeSingle();
      
      organizationId = profile?.organization_id || undefined;
    } catch (error) {
      console.error('Error fetching user organization:', error);
    }
  } else {
    // Fall back to anonymous ID
    userId = getOrCreateAnonymousId();
    console.log('Using anonymous user ID:', userId);
    await ensureUserProfileExists(userId);
    const profile = await getUserProfile();
    organizationId = profile?.organizationId;
  }
  
  return {
    id: userId,
    organizationId
  };
};

// User Profile Management
export const saveUserProfile = async (profile: UserProfile): Promise<boolean> => {
  try {
    // Save to localStorage
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    
    // If using Supabase, also save there
    if (getUseSupabase()) {
      return await saveUserProfileToSupabase(profile);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save user profile:', error);
    return false;
  }
};

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
    console.error('Error saving profile to Supabase:', error);
    return false;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    // First check if user is authenticated with Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    let userId: string;
    
    if (session?.user) {
      // Use authenticated user ID
      userId = session.user.id;
      
      // Try to get profile from Supabase for authenticated users
      if (getUseSupabase()) {
        const supabaseProfile = await getUserProfileFromSupabase(userId);
        if (supabaseProfile) {
          // Update local storage with the latest from Supabase
          localStorage.setItem(PROFILE_KEY, JSON.stringify(supabaseProfile));
          return supabaseProfile;
        }
      }
      
      // If no Supabase profile found, create one from auth data
      const authProfile: UserProfile = {
        id: userId,
        email: session.user.email || `user@${userId.substring(0, 8)}.com`,
        createdAt: session.user.created_at || new Date().toISOString(),
        name: session.user.user_metadata?.name || session.user.user_metadata?.full_name,
      };
      
      // Save this profile
      await saveUserProfile(authProfile);
      return authProfile;
    } else {
      // Fall back to anonymous ID for non-authenticated users
      userId = getOrCreateAnonymousId();
      
      // If using Supabase, try to get from there first
      if (getUseSupabase()) {
        const supabaseProfile = await getUserProfileFromSupabase(userId);
        if (supabaseProfile) {
          // Update local storage with the latest from Supabase
          localStorage.setItem(PROFILE_KEY, JSON.stringify(supabaseProfile));
          return supabaseProfile;
        }
      }
      
      // Fall back to localStorage
      const profileJson = localStorage.getItem(PROFILE_KEY);
      if (profileJson) {
        return JSON.parse(profileJson);
      }
      
      // If no profile exists, create a minimal one
      const minimalProfile: UserProfile = {
        id: userId,
        email: `anonymous@${userId.substring(0, 8)}.com`,
        createdAt: new Date().toISOString(),
      };
      
      // Save this minimal profile
      await saveUserProfile(minimalProfile);
      return minimalProfile;
    }
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
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
    console.error('Error getting profile from Supabase:', error);
    return null;
  }
};
