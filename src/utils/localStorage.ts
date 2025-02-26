
import { HEARTIAssessment } from '../types';

const STORAGE_KEY = 'hearti-assessments';

// Save assessment to localStorage
export const saveAssessment = (assessment: HEARTIAssessment): void => {
  try {
    const existingAssessments = getAssessments();
    const assessments = [...existingAssessments, assessment];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  } catch (error) {
    console.error('Failed to save assessment:', error);
  }
};

// Get all assessments from localStorage
export const getAssessments = (): HEARTIAssessment[] => {
  try {
    const assessmentsJson = localStorage.getItem(STORAGE_KEY);
    return assessmentsJson ? JSON.parse(assessmentsJson) : [];
  } catch (error) {
    console.error('Failed to retrieve assessments:', error);
    return [];
  }
};

// Delete assessment from localStorage
export const deleteAssessment = (id: string): void => {
  try {
    const existingAssessments = getAssessments();
    const filteredAssessments = existingAssessments.filter(
      (assessment) => assessment.id !== id
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAssessments));
  } catch (error) {
    console.error('Failed to delete assessment:', error);
  }
};

// Clear all assessments from localStorage
export const clearAssessments = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear assessments:', error);
  }
};
