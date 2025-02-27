
import { HEARTIAssessment, UserProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';

const ASSESSMENTS_KEY = 'hearti-assessments';
const USERS_KEY = 'hearti-users';
const CURRENT_USER_KEY = 'hearti-current-user';

// User Management

export const createUser = (name?: string, email?: string): UserProfile => {
  try {
    const newUser: UserProfile = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      name,
      email
    };
    
    const existingUsers = getUsers();
    const users = [...existingUsers, newUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Set as current user
    setCurrentUser(newUser.id);
    
    return newUser;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

export const getUsers = (): UserProfile[] => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    return [];
  }
};

export const getUserById = (userId: string): UserProfile | undefined => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const setCurrentUser = (userId: string): void => {
  localStorage.setItem(CURRENT_USER_KEY, userId);
};

export const getCurrentUser = (): UserProfile | null => {
  try {
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserId) return null;
    
    const user = getUserById(currentUserId);
    return user || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const ensureUserExists = (): UserProfile => {
  const currentUser = getCurrentUser();
  if (currentUser) return currentUser;
  
  // If no current user, create one
  return createUser();
};

// Assessment Management

export const saveAssessment = (assessment: HEARTIAssessment): void => {
  try {
    const existingAssessments = getAssessments();
    const assessments = [...existingAssessments, assessment];
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
  } catch (error) {
    console.error('Failed to save assessment:', error);
  }
};

export const getAssessments = (): HEARTIAssessment[] => {
  try {
    const assessmentsJson = localStorage.getItem(ASSESSMENTS_KEY);
    return assessmentsJson ? JSON.parse(assessmentsJson) : [];
  } catch (error) {
    console.error('Failed to retrieve assessments:', error);
    return [];
  }
};

export const getAssessmentsByUserId = (userId: string): HEARTIAssessment[] => {
  const allAssessments = getAssessments();
  return allAssessments.filter(assessment => assessment.userId === userId);
};

export const getCurrentUserAssessments = (): HEARTIAssessment[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  return getAssessmentsByUserId(currentUser.id);
};

export const deleteAssessment = (id: string): void => {
  try {
    const existingAssessments = getAssessments();
    const currentUser = getCurrentUser();
    
    // Only allow deletion if the assessment belongs to the current user
    if (currentUser) {
      const filteredAssessments = existingAssessments.filter(
        (assessment) => assessment.id !== id || assessment.userId !== currentUser.id
      );
      localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
    }
  } catch (error) {
    console.error('Failed to delete assessment:', error);
  }
};

export const clearUserAssessments = (userId: string): void => {
  try {
    const existingAssessments = getAssessments();
    const filteredAssessments = existingAssessments.filter(
      (assessment) => assessment.userId !== userId
    );
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filteredAssessments));
  } catch (error) {
    console.error('Failed to clear user assessments:', error);
  }
};

export const clearAssessments = (): void => {
  try {
    localStorage.removeItem(ASSESSMENTS_KEY);
  } catch (error) {
    console.error('Failed to clear assessments:', error);
  }
};
