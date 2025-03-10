
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '../../types';
import { ensureUserProfileExists } from '../supabase/profiles';
import { ANONYMOUS_ID_KEY, PROFILE_KEY } from './constants';
import { getUseSupabase } from './settings';

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
  const userId = getOrCreateAnonymousId();
  await ensureUserProfileExists(userId);
  const profile = await getUserProfile();
  return {
    id: userId,
    organizationId: profile?.organizationId
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
    // Implementation would go here
    return true;
  } catch (error) {
    console.error('Error saving profile to Supabase:', error);
    return false;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const userId = getOrCreateAnonymousId();
    
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
      createdAt: new Date().toISOString(),
    };
    
    // Save this minimal profile
    await saveUserProfile(minimalProfile);
    
    return minimalProfile;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
};

export const getUserProfileFromSupabase = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Implementation would go here
    return null;
  } catch (error) {
    console.error('Error getting profile from Supabase:', error);
    return null;
  }
};
