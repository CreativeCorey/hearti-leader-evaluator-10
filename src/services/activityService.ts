
// This file now serves as a facade for the more specialized services
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import { 
  saveActivity as saveSavedActivity,
  getSavedActivities,
  toggleActivityCompletion,
  removeSavedActivity
} from './savedActivitiesService';
import { addActivityToHabitTracker } from './habitTrackerService';

// Re-export all the functions for backward compatibility
export { 
  getSavedActivities,
  toggleActivityCompletion,
  removeSavedActivity,
  addActivityToHabitTracker
};

// Create a new saved activity
export const saveActivity = async (
  userId: string,
  activity: SkillActivity,
  addToHabitTracker: boolean = false,
  frequency: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<SavedActivity> => {
  return saveSavedActivity(userId, activity, addToHabitTracker, frequency);
};
