
import { HEARTIAssessment } from '../../types';
import { saveAssessmentToSupabase, getUserAssessmentsFromSupabase } from '../supabase/assessments';
import { ensureUserProfileExists } from '../supabase/profiles';
import { ASSESSMENTS_KEY } from './constants';
import { getOrCreateAnonymousId } from './user';
import { getUseSupabase } from './settings';

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
    
    console.log('Saving assessment to localStorage:', assessment.id);
    
    // Save to localStorage
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(existingAssessments));
    
    // If using Supabase, also save there
    if (getUseSupabase()) {
      console.log('Saving assessment to Supabase:', assessment.id);
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
    console.log('Getting assessments for user:', userId);
    
    // First try to get from localStorage
    const allAssessments = await getLocalAssessments();
    const localUserAssessments = allAssessments.filter(assessment => assessment.userId === userId);
    
    console.log('Found local assessments:', localUserAssessments.length);
    
    // If using Supabase, try to get from there as well
    if (getUseSupabase()) {
      try {
        const supabaseAssessments = await getUserAssessmentsFromSupabase(userId);
        console.log('Found Supabase assessments:', supabaseAssessments.length);
        
        // Merge assessments from both sources, prioritizing Supabase
        const mergedAssessments = [...localUserAssessments];
        
        for (const supabaseAssessment of supabaseAssessments) {
          const existingIndex = mergedAssessments.findIndex(a => a.id === supabaseAssessment.id);
          if (existingIndex >= 0) {
            mergedAssessments[existingIndex] = supabaseAssessment;
          } else {
            mergedAssessments.push(supabaseAssessment);
          }
        }
        
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
