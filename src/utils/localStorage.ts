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
    
    if (useSupabase()) {
      ensureUserProfileExists(anonymousId)
        .then(success => {
          console.log("Profile creation result for new ID:", success);
          if (!success) {
            console.error("Failed to create profile for new anonymous ID");
          }
        })
        .catch(err => {
          console.error("Failed to create anonymous profile:", err);
        });
    }
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
    
    if (useSupabase()) {
      const profileExists = await ensureUserProfileExists(userId);
      console.log("Profile exists check result:", profileExists);
      if (!profileExists) {
        console.error("Failed to ensure profile exists before creating user");
      }
    }
    
    const newUser: UserProfile = {
      id: userId,
      createdAt: new Date().toISOString(),
      name,
      email: email || `anonymous@${userId.substring(0, 8)}.com`,
      organizationId,
      role
    };
    
    if (useSupabase()) {
      const success = await saveUserProfileToSupabase(newUser);
      if (!success) {
        throw new Error('Failed to save user to Supabase');
      }
    } else {
      const existingUsers = await getUsers();
      const users = [...existingUsers, newUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
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
    if (useSupabase()) {
      const user = await getUserProfileFromSupabase(userId);
      return user || undefined;
    } else {
      const users = await getUsers();
      return users.find(user => user.id === userId);
    }
  } catch (error) {
    console.error('Failed to retrieve user by ID:', error);
    return undefined;
  }
};

export const updateUser = async (userId: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): Promise<UserProfile | null> => {
  try {
    if (useSupabase()) {
      const currentUser = await getUserById(userId);
      if (!currentUser) return null;
      
      const updatedUser = { ...currentUser, ...updates };
      const success = await saveUserProfileToSupabase(updatedUser);
      if (!success) return null;
      
      return updatedUser;
    } else {
      const users = await getUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) return null;
      
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return updatedUser;
    }
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
    
    const user = await getUserById(userId);
    
    if (!user && useSupabase()) {
      console.log("No user profile found, creating one...");
      try {
        const profileCreated = await ensureUserProfileExists(userId);
        console.log("Profile creation result:", profileCreated);
        
        if (profileCreated) {
          const profile = await getUserProfileFromSupabase(userId);
          console.log("Retrieved profile from Supabase:", profile);
          return profile;
        } else {
          console.log("Creating full user since profile creation failed");
          return await createUser(undefined, undefined, undefined, 'user');
        }
      } catch (err) {
        console.error("Failed to create user profile:", err);
        return null;
      }
    }
    
    return user || null;
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
    
    if (useSupabase()) {
      const profileExists = await ensureUserProfileExists(assessment.userId);
      console.log("Profile exists check result:", profileExists);
      
      if (!profileExists) {
        console.error("Failed to ensure profile exists before saving assessment");
        throw new Error('Failed to ensure user profile exists');
      }
      
      const success = await saveAssessmentToSupabase(assessment);
      if (!success) {
        throw new Error('Failed to save assessment to Supabase');
      }
      
      console.log("Assessment saved successfully to Supabase");
    } else {
      const existingAssessments = await getAssessments();
      const assessments = [...existingAssessments, assessment];
      localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
      console.log("Assessment saved successfully to localStorage");
    }
  } catch (error) {
    console.error('Failed to save assessment:', error);
    throw error; // Rethrow to allow proper error handling
  }
};

export const getAssessments = async (): Promise<HEARTIAssessment[]> => {
  try {
    if (useSupabase()) {
      return await getAssessmentsFromSupabase();
    } else {
      const assessmentsJson = localStorage.getItem(ASSESSMENTS_KEY);
      return assessmentsJson ? JSON.parse(assessmentsJson) : [];
    }
  } catch (error) {
    console.error('Failed to retrieve assessments:', error);
    return [];
  }
};

export const getAssessmentsByUserId = async (userId: string): Promise<HEARTIAssessment[]> => {
  try {
    if (useSupabase()) {
      return await getUserAssessmentsFromSupabase(userId);
    } else {
      const allAssessments = await getAssessments();
      return allAssessments.filter(assessment => assessment.userId === userId);
    }
  } catch (error) {
    console.error('Failed to retrieve assessments by user ID:', error);
    return [];
  }
};

export const getAssessmentsByOrganizationId = async (organizationId: string): Promise<HEARTIAssessment[]> => {
  try {
    if (useSupabase()) {
      return await getOrganizationAssessmentsFromSupabase(organizationId);
    } else {
      const allAssessments = await getAssessments();
      return allAssessments.filter(assessment => assessment.organizationId === organizationId);
    }
  } catch (error) {
    console.error('Failed to retrieve assessments by organization ID:', error);
    return [];
  }
};

export const getCurrentUserAssessments = async (): Promise<HEARTIAssessment[]> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      const anonymousId = getOrCreateAnonymousId();
      return await getAssessmentsByUserId(anonymousId);
    }
    return await getAssessmentsByUserId(currentUser.id);
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
    if (useSupabase()) {
      const success = await deleteAssessmentFromSupabase(id);
      if (!success) {
        throw new Error('Failed to delete assessment from Supabase');
      }
    } else {
      const existingAssessments = await getAssessments();
      const currentUser = await getCurrentUser();
      
      if (currentUser) {
        const filteredAssessments = existingAssessments.filter(assessment => {
          if (currentUser.role === 'admin' && assessment.organizationId === currentUser.organizationId) {
            return assessment.id !== id;
          }
          return assessment.id !== id || assessment.userId !== currentUser.id;
        });
        
        localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
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
    
    for (const org of localOrganizations) {
      const success = await saveOrganizationToSupabase(org);
      if (!success) {
        console.error('Failed to sync organization to Supabase:', org);
      }
    }
    
    for (const user of localUsers) {
      const success = await saveUserProfileToSupabase(user);
      if (!success) {
        console.error('Failed to sync user to Supabase:', user);
      }
    }
    
    for (const assessment of localAssessments) {
      const success = await saveAssessmentToSupabase(assessment);
      if (!success) {
        console.error('Failed to sync assessment to Supabase:', assessment);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync local data to Supabase:', error);
    return false;
  }
};
