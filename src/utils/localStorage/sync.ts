
import { saveAssessmentToSupabase } from '../supabase/assessments';
import { ensureUserProfileExists } from '../supabase/profiles';
import { getLocalAssessments } from './assessments';
import { getOrCreateAnonymousId } from './user';

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
