
import { HEARTIAssessment, UserProfile, Organization } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  saveAssessmentToSupabase, 
  getAssessmentsFromSupabase,
  getUserAssessmentsFromSupabase,
  getOrganizationAssessmentsFromSupabase,
  deleteAssessmentFromSupabase,
  saveUserProfileToSupabase,
  getUserProfileFromSupabase,
  saveOrganizationToSupabase,
  getOrganizationsFromSupabase,
  getOrganizationByIdFromSupabase,
  ensureUserProfileExists
} from './supabaseHelpers';
import { useAuth } from '../contexts/AuthContext';

const ASSESSMENTS_KEY = 'hearti-assessments';
const USERS_KEY = 'hearti-users';
const CURRENT_USER_KEY = 'hearti-current-user';
const ORGANIZATIONS_KEY = 'hearti-organizations';
const USE_SUPABASE_KEY = 'hearti-use-supabase';
const ANONYMOUS_USER_KEY = 'hearti-anonymous-user-id';

export const getOrCreateAnonymousId = (): string => {
  let anonymousId = localStorage.getItem(ANONYMOUS_USER_KEY);
  
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem(ANONYMOUS_USER_KEY, anonymousId);
    console.log("Created new anonymous ID:", anonymousId);
  }
  
  return anonymousId;
};

export const useSupabase = (): boolean => {
  try {
    const useSupabaseStr = localStorage.getItem(USE_SUPABASE_KEY);
    return useSupabaseStr ? JSON.parse(useSupabaseStr) : false;
  } catch (error) {
    console.error('Failed to check Supabase usage flag:', error);
    return false;
  }
};

export const setUseSupabase = (value: boolean): void => {
  try {
    localStorage.setItem(USE_SUPABASE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to set Supabase usage flag:', error);
  }
};

export const createOrganization = async (name: string, description?: string): Promise<Organization> => {
  try {
    const newOrganization: Organization = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      name,
      description
    };
    
    if (useSupabase()) {
      const success = await saveOrganizationToSupabase(newOrganization);
      if (!success) {
        throw new Error('Failed to save organization to Supabase');
      }
    } else {
      const existingOrganizations = await getOrganizations();
      const organizations = [...existingOrganizations, newOrganization];
      localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(organizations));
    }
    
    return newOrganization;
  } catch (error) {
    console.error('Failed to create organization:', error);
    throw error;
  }
};

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    if (useSupabase()) {
      return await getOrganizationsFromSupabase();
    } else {
      const organizationsJson = localStorage.getItem(ORGANIZATIONS_KEY);
      return organizationsJson ? JSON.parse(organizationsJson) : [];
    }
  } catch (error) {
    console.error('Failed to retrieve organizations:', error);
    return [];
  }
};

export const getOrganizationById = async (organizationId: string): Promise<Organization | undefined> => {
  try {
    if (useSupabase()) {
      const org = await getOrganizationByIdFromSupabase(organizationId);
      return org || undefined;
    } else {
      const organizations = await getOrganizations();
      return organizations.find(org => org.id === organizationId);
    }
  } catch (error) {
    console.error('Failed to retrieve organization by ID:', error);
    return undefined;
  }
};

export const createUser = async (
  name?: string, 
  email?: string, 
  organizationId?: string, 
  role: 'user' | 'admin' = 'user'
): Promise<UserProfile> => {
  try {
    const userId = getOrCreateAnonymousId();
    console.log("Creating user with ID:", userId);
    
    const newUser: UserProfile = {
      id: userId,
      createdAt: new Date().toISOString(),
      name,
      email: email || `anonymous@${userId.substring(0, 8)}.com`,
      organizationId,
      role
    };
    
    if (useSupabase()) {
      try {
        // First try to ensure the profile exists
        await ensureUserProfileExists(userId);
        
        // Then try to save the user profile
        const success = await saveUserProfileToSupabase(newUser);
        if (!success) {
          console.warn('Failed to save user to Supabase, falling back to localStorage');
        }
      } catch (error) {
        console.error('Error with Supabase operations:', error);
        // Continue with localStorage fallback
      }
    }
    
    // Always save to localStorage as a fallback
    const existingUsers = await getUsers();
    const users = [...existingUsers.filter(u => u.id !== userId), newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    await setCurrentUser(newUser.id);
    console.log("User created successfully:", newUser);
    
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    return [];
  }
};

export const getUsersByOrganizationId = async (organizationId: string): Promise<UserProfile[]> => {
  try {
    const users = await getUsers();
    return users.filter(user => user.organizationId === organizationId);
  } catch (error) {
    console.error('Failed to retrieve users by organization ID:', error);
    return [];
  }
};

export const getUserById = async (userId: string): Promise<UserProfile | undefined> => {
  try {
    // First try localStorage
    const users = await getUsers();
    const localUser = users.find(user => user.id === userId);
    if (localUser) return localUser;
    
    // Then try Supabase if enabled
    if (useSupabase()) {
      const user = await getUserProfileFromSupabase(userId);
      return user || undefined;
    }
    
    return undefined;
  } catch (error) {
    console.error('Failed to retrieve user by ID:', error);
    return undefined;
  }
};

export const updateUser = async (userId: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): Promise<UserProfile | null> => {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return null;
    
    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    
    // Update in localStorage
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update in Supabase if enabled
    if (useSupabase()) {
      try {
        await saveUserProfileToSupabase(updatedUser);
      } catch (error) {
        console.error('Failed to update user in Supabase:', error);
        // Continue anyway since we updated in localStorage
      }
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user:', error);
    return null;
  }
};

export const setCurrentUser = async (userId: string): Promise<void> => {
  try {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } catch (error) {
    console.error('Failed to set current user:', error);
  }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const userId = localStorage.getItem(CURRENT_USER_KEY) || getOrCreateAnonymousId();
    console.log("Getting current user with ID:", userId);
    
    if (!userId) return null;
    
    // Check localStorage first
    const localUsers = await getUsers();
    const localUser = localUsers.find(u => u.id === userId);
    
    if (localUser) {
      console.log("Found user in localStorage:", localUser);
      return localUser;
    }
    
    // If not in localStorage and Supabase is enabled, try there
    if (useSupabase()) {
      try {
        const profile = await getUserProfileFromSupabase(userId);
        if (profile) {
          console.log("Retrieved profile from Supabase:", profile);
          
          // Also save to localStorage for future use
          await setCurrentUser(userId);
          const existingUsers = await getUsers();
          localStorage.setItem(USERS_KEY, JSON.stringify([...existingUsers, profile]));
          
          return profile;
        }
      } catch (err) {
        console.error("Failed to get user profile from Supabase:", err);
      }
    }
    
    // If we get here, we need to create a new user
    console.log("Creating new user since none was found");
    return await createUser(undefined, undefined, undefined, 'user');
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const ensureUserExists = async (): Promise<UserProfile> => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) return currentUser;
    
    return await createUser();
  } catch (error) {
    console.error('Failed to ensure user exists:', error);
    throw error;
  }
};

export const saveAssessment = async (assessment: HEARTIAssessment): Promise<void> => {
  try {
    if (!assessment.userId) {
      assessment.userId = getOrCreateAnonymousId();
      console.log("Using anonymous ID for assessment:", assessment.userId);
    }
    
    // Always save to localStorage first for reliability
    const existingAssessments = await getAssessments();
    const assessments = [...existingAssessments.filter(a => a.id !== assessment.id), assessment];
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
    console.log("Assessment saved successfully to localStorage");
    
    // If Supabase is enabled, try to save there too
    if (useSupabase()) {
      try {
        await ensureUserProfileExists(assessment.userId);
        const success = await saveAssessmentToSupabase(assessment);
        if (!success) {
          console.warn('Failed to save assessment to Supabase, but it was saved to localStorage');
        } else {
          console.log("Assessment saved successfully to Supabase");
        }
      } catch (error) {
        console.error('Error saving to Supabase:', error);
        // Continue since we already saved to localStorage
      }
    }
  } catch (error) {
    console.error('Failed to save assessment:', error);
    throw error; // Rethrow to allow proper error handling
  }
};

export const getAssessments = async (): Promise<HEARTIAssessment[]> => {
  try {
    // First get from localStorage
    const assessmentsJson = localStorage.getItem(ASSESSMENTS_KEY);
    const localAssessments = assessmentsJson ? JSON.parse(assessmentsJson) : [];
    
    // If Supabase is enabled, try to get from there as well and merge
    if (useSupabase()) {
      try {
        const supabaseAssessments = await getAssessmentsFromSupabase();
        
        // Create a map to deduplicate by ID
        const assessmentMap = new Map<string, HEARTIAssessment>();
        
        // Add all assessments to the map (Supabase overrides local if same ID)
        [...localAssessments, ...supabaseAssessments].forEach(assessment => {
          assessmentMap.set(assessment.id, assessment);
        });
        
        return Array.from(assessmentMap.values());
      } catch (error) {
        console.error('Failed to retrieve assessments from Supabase:', error);
        // Return local assessments as fallback
        return localAssessments;
      }
    }
    
    return localAssessments;
  } catch (error) {
    console.error('Failed to retrieve assessments:', error);
    return [];
  }
};

export const getAssessmentsByUserId = async (userId: string): Promise<HEARTIAssessment[]> => {
  try {
    const allAssessments = await getAssessments();
    return allAssessments.filter(assessment => assessment.userId === userId);
  } catch (error) {
    console.error('Failed to retrieve assessments by user ID:', error);
    return [];
  }
};

export const getAssessmentsByOrganizationId = async (organizationId: string): Promise<HEARTIAssessment[]> => {
  try {
    const allAssessments = await getAssessments();
    return allAssessments.filter(assessment => assessment.organizationId === organizationId);
  } catch (error) {
    console.error('Failed to retrieve assessments by organization ID:', error);
    return [];
  }
};

export const getCurrentUserAssessments = async (): Promise<HEARTIAssessment[]> => {
  try {
    const userId = localStorage.getItem(CURRENT_USER_KEY) || getOrCreateAnonymousId();
    return await getAssessmentsByUserId(userId);
  } catch (error) {
    console.error('Failed to retrieve current user assessments:', error);
    return [];
  }
};

export const getOrganizationAssessments = async (organizationId: string): Promise<HEARTIAssessment[]> => {
  try {
    if (useSupabase()) {
      return await getOrganizationAssessmentsFromSupabase(organizationId);
    } else {
      const allAssessments = await getAssessments();
      return allAssessments.filter(assessment => assessment.organizationId === organizationId);
    }
  } catch (error) {
    console.error('Failed to retrieve organization assessments:', error);
    return [];
  }
};

export const deleteAssessment = async (id: string): Promise<void> => {
  try {
    // Delete from localStorage
    const existingAssessments = await getAssessments();
    const filteredAssessments = existingAssessments.filter(assessment => assessment.id !== id);
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
    
    // Delete from Supabase if enabled
    if (useSupabase()) {
      try {
        await deleteAssessmentFromSupabase(id);
      } catch (error) {
        console.error('Failed to delete assessment from Supabase:', error);
        // Continue anyway since we deleted from localStorage
      }
    }
  } catch (error) {
    console.error('Failed to delete assessment:', error);
  }
};

export const clearUserAssessments = async (userId: string): Promise<void> => {
  try {
    const existingAssessments = await getAssessments();
    const filteredAssessments = existingAssessments.filter(
      (assessment) => assessment.userId !== userId
    );
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
  } catch (error) {
    console.error('Failed to clear user assessments:', error);
  }
};

export const clearOrganizationAssessments = async (organizationId: string): Promise<void> => {
  try {
    const existingAssessments = await getAssessments();
    const filteredAssessments = existingAssessments.filter(
      (assessment) => assessment.organizationId !== organizationId
    );
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
  } catch (error) {
    console.error('Failed to clear organization assessments:', error);
  }
};

export const clearAssessments = async (): Promise<void> => {
  try {
    localStorage.removeItem(ASSESSMENTS_KEY);
  } catch (error) {
    console.error('Failed to clear assessments:', error);
  }
};

export const syncLocalDataToSupabase = async (): Promise<boolean> => {
  try {
    const localAssessments = JSON.parse(localStorage.getItem(ASSESSMENTS_KEY) || '[]');
    const localUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const localOrganizations = JSON.parse(localStorage.getItem(ORGANIZATIONS_KEY) || '[]');
    
    // Try to ensure user profiles exist first
    for (const user of localUsers) {
      try {
        await ensureUserProfileExists(user.id);
      } catch (error) {
        console.error('Failed to ensure user profile exists for sync:', user.id, error);
      }
    }
    
    for (const org of localOrganizations) {
      try {
        const success = await saveOrganizationToSupabase(org);
        if (!success) {
          console.error('Failed to sync organization to Supabase:', org);
        }
      } catch (error) {
        console.error('Error syncing organization to Supabase:', error);
      }
    }
    
    for (const user of localUsers) {
      try {
        const success = await saveUserProfileToSupabase(user);
        if (!success) {
          console.error('Failed to sync user to Supabase:', user);
        }
      } catch (error) {
        console.error('Error syncing user to Supabase:', error);
      }
    }
    
    for (const assessment of localAssessments) {
      try {
        const success = await saveAssessmentToSupabase(assessment);
        if (!success) {
          console.error('Failed to sync assessment to Supabase:', assessment);
        }
      } catch (error) {
        console.error('Error syncing assessment to Supabase:', error);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync local data to Supabase:', error);
    return false;
  }
};
