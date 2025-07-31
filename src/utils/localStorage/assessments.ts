
import { HEARTIAssessment } from '../../types';
import { saveAssessmentToSupabase, getUserAssessmentsFromSupabase } from '../supabase/assessments';
import { ensureUserProfileExists } from '../supabase/profiles';
import { ASSESSMENTS_KEY } from './constants';
import { getOrCreateAnonymousId, ensureUserExists } from './user';
import { getUseSupabase } from './settings';
import { migrateLocalStorageToSupabase } from './migration';

// Assessment Management
export const saveAssessment = async (assessment: HEARTIAssessment): Promise<boolean> => {
  try {
    // Ensure the assessment has a user ID (use authenticated user if available)
    if (!assessment.userId) {
      const { id: userId } = await ensureUserExists();
      assessment.userId = userId;
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
    
    console.log('Saving assessment to localStorage:', assessment.id);
    
    // Save to localStorage first (this always works)
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(existingAssessments));
    
    // If using Supabase, also save there
    if (getUseSupabase()) {
      console.log('Ensuring user profile exists before saving assessment');
      try {
        // Ensure user profile exists first
        await ensureUserProfileExists(assessment.userId);
        
        console.log('Saving assessment to Supabase:', assessment.id);
        // Then save the assessment
        await saveAssessmentToSupabase(assessment);
      } catch (supabaseError) {
        console.error('Failed to save to Supabase, but localStorage save succeeded:', supabaseError);
        // Don't throw error - assessment is saved locally
      }
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
    // Get the current user ID (authenticated or anonymous)
    const { id: userId } = await ensureUserExists();
    console.log('Getting assessments for user:', userId);
    
    // First try to get from localStorage
    const allAssessments = await getLocalAssessments();
    const localUserAssessments = allAssessments.filter(assessment => assessment.userId === userId);
    
    console.log('Found local assessments:', localUserAssessments.length);
    
    // If using Supabase, try to get from there as well
    if (getUseSupabase()) {
      try {
        // First, attempt to migrate any localStorage data to Supabase
        const localAssessments = await getLocalAssessments();
        const localUserAssessments = localAssessments.filter(assessment => assessment.userId === userId);
        
        if (localUserAssessments.length > 0) {
          console.log('Found local assessments, attempting migration...');
          await migrateLocalStorageToSupabase();
        }
        
        const supabaseAssessments = await getUserAssessmentsFromSupabase(userId);
        console.log('Found Supabase assessments:', supabaseAssessments.length);
        
        // Get fresh local assessments after potential migration
        const updatedLocalAssessments = await getLocalAssessments();
        const updatedLocalUserAssessments = updatedLocalAssessments.filter(assessment => assessment.userId === userId);
        
        // Merge assessments from both sources, prioritizing Supabase
        const mergedAssessments = [...updatedLocalUserAssessments];
        
        for (const supabaseAssessment of supabaseAssessments) {
          const existingIndex = mergedAssessments.findIndex(a => a.id === supabaseAssessment.id);
          if (existingIndex >= 0) {
            mergedAssessments[existingIndex] = supabaseAssessment;
          } else {
            mergedAssessments.push(supabaseAssessment);
          }
        }
        
        // Store the merged assessments back in localStorage to keep it in sync
        const allLocalAssessments = await getLocalAssessments();
        localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify([
          ...allLocalAssessments.filter(a => a.userId !== userId),
          ...mergedAssessments
        ]));
        
        return mergedAssessments;
      } catch (error) {
        console.error('Failed to get Supabase assessments:', error);
        // Fall back to local assessments
        return localUserAssessments;
      }
    }
    
    return localUserAssessments;
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
