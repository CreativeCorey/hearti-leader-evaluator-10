import { v4 as uuidv4 } from 'uuid';
import { HEARTIAssessment, UserProfile, HEARTIDimension, HEARTIAnswer, Demographics } from '../types';
import { ensureUserProfileExists, saveUserProfileToSupabase, getUserProfileFromSupabase } from './supabase/profiles';
import { saveAssessmentToSupabase, getUserAssessmentsFromSupabase } from './supabase/assessments';

// Local Storage Keys
const ANONYMOUS_ID_KEY = 'hearti-anonymous-id';
const ASSESSMENTS_KEY = 'hearti-assessments';
const USE_SUPABASE_KEY = 'hearti-use-supabase';
const PROFILE_KEY = 'hearti-profile';

// User ID Management
export const getOrCreateAnonymousId = (): string => {
  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  }
  
  return anonymousId;
};

// Supabase Usage Flag
export const getUseSupabase = (): boolean => {
  const useSupabase = localStorage.getItem(USE_SUPABASE_KEY);
  return useSupabase === 'true';
};

export const setUseSupabase = (useSupabase: boolean): void => {
  localStorage.setItem(USE_SUPABASE_KEY, useSupabase.toString());
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

// Assessment Management
export const saveAssessment = async (assessment: HEARTIAssessment): Promise<boolean> => {
  try {
    // Ensure the assessment has a user ID
    if (!assessment.userId) {
      assessment.userId = getOrCreateAnonymousId();
    }
    
    // Get existing assessments
    const existingAssessments = await getLocalAssessments();
    
    // Add or update the assessment
    const existingIndex = existingAssessments.findIndex(a => a.id === assessment.id);
    if (existingIndex >= 0) {
      existingAssessments[existingIndex] = assessment;
    } else {
      existingAssessments.push(assessment);
    }
    
    // Save to localStorage
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(existingAssessments));
    
    // If using Supabase, also save there
    if (getUseSupabase()) {
      // Ensure user profile exists first
      await ensureUserProfileExists(assessment.userId);
      
      // Then save the assessment
      return await saveAssessmentToSupabase(assessment);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save assessment:', error);
    return false;
  }
};

export const getLocalAssessments = async (): Promise<HEARTIAssessment[]> => {
  try {
    const assessmentsJson = localStorage.getItem(ASSESSMENTS_KEY);
    if (!assessmentsJson) return [];
    
    return JSON.parse(assessmentsJson);
  } catch (error) {
    console.error('Failed to get local assessments:', error);
    return [];
  }
};

export const getCurrentUserAssessments = async (): Promise<HEARTIAssessment[]> => {
  try {
    const userId = getOrCreateAnonymousId();
    
    // If using Supabase, get from there
    if (getUseSupabase()) {
      return await getUserAssessmentsFromSupabase(userId);
    }
    
    // Otherwise, get from localStorage and filter by user ID
    const allAssessments = await getLocalAssessments();
    return allAssessments.filter(assessment => assessment.userId === userId);
  } catch (error) {
    console.error('Failed to get current user assessments:', error);
    return [];
  }
};

export const deleteLocalAssessment = async (assessmentId: string): Promise<boolean> => {
  try {
    const assessments = await getLocalAssessments();
    const filteredAssessments = assessments.filter(a => a.id !== assessmentId);
    
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
    return true;
  } catch (error) {
    console.error('Failed to delete local assessment:', error);
    return false;
  }
};

// Sync local data to Supabase
export const syncLocalDataToSupabase = async (): Promise<boolean> => {
  try {
    // Get the user ID
    const userId = getOrCreateAnonymousId();
    
    // Ensure user profile exists in Supabase
    const profileExists = await ensureUserProfileExists(userId);
    
    // Get local assessments
    const localAssessments = await getLocalAssessments();
    const userAssessments = localAssessments.filter(a => a.userId === userId);
    
    // If there are no assessments to sync, return success
    if (userAssessments.length === 0) {
      return true;
    }
    
    // Sync each assessment to Supabase
    const syncPromises = userAssessments.map(assessment => saveAssessmentToSupabase(assessment));
    const results = await Promise.all(syncPromises);
    
    // If any sync failed, return false
    if (results.includes(false)) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync local data to Supabase:', error);
    return false;
  }
};
