import { HEARTIAssessment } from '@/types';
import { useAssessmentQuestions } from './assessment/useAssessmentQuestions';
import { useUserInitialization } from './assessment/useUserInitialization';
import { useAssessmentCompletion } from './assessment/useAssessmentCompletion';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { checkRateLimit, validateScore } from '@/utils/input-validation';

// LocalStorage key for saving assessment progress
const ASSESSMENT_PROGRESS_KEY = 'assessment_progress';

export const useAssessmentForm = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const [initializing, setInitializing] = useState(true);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize assessment questions and user data
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    setAnswers,
    getCurrentAnswer,
    handleAnswerChange,
    handleNext,
    handlePrevious,
    progressPercentage,
    transition,
    shuffledQuestions,
    setCurrentQuestionIndex
  } = useAssessmentQuestions();

  // Get current user information
  const { currentUser, loading: userLoading } = useUserInitialization();

  // Handle assessment completion
  const {
    assessmentComplete,
    completeAssessmentQuestions,
    handleDemographicsComplete,
    handleSkipDemographics,
    previousDemographics,
    tempAssessment // Get access to the tempAssessment from the hook
  } = useAssessmentCompletion(answers, currentUser, onComplete);
  
  // Safe function to save progress to prevent errors
  const saveProgress = useCallback(() => {
    if (answers.length > 0 && !assessmentComplete && currentQuestionIndex >= 0) {
      try {
        localStorage.setItem(ASSESSMENT_PROGRESS_KEY, JSON.stringify({
          questionIndex: currentQuestionIndex,
          savedAnswers: answers
        }));
        console.log("Saved assessment progress:", { currentQuestionIndex, answersCount: answers.length });
      } catch (error) {
        console.error("Error saving assessment progress:", error);
      }
    }
  }, [answers, currentQuestionIndex, assessmentComplete]);
  
  // Load saved progress from localStorage when component initializes
  useEffect(() => {
    if (!userLoading && shuffledQuestions.length > 0 && !assessmentComplete && !isSubmitting) {
      try {
        const savedProgress = localStorage.getItem(ASSESSMENT_PROGRESS_KEY);
        if (savedProgress) {
          const { questionIndex, savedAnswers } = JSON.parse(savedProgress);
          
          // Validate saved data before using it
          if (
            Number.isInteger(questionIndex) && 
            questionIndex >= 0 && 
            questionIndex < shuffledQuestions.length &&
            Array.isArray(savedAnswers) &&
            savedAnswers.length > 0
          ) {
            console.log("Restoring assessment progress:", { questionIndex, answersCount: savedAnswers.length });
            setCurrentQuestionIndex(questionIndex);
            setAnswers(savedAnswers);
          }
        }
      } catch (error) {
        console.error("Error loading saved assessment progress:", error);
      }
      
      setInitializing(false);
    } else if (!userLoading && shuffledQuestions.length > 0) {
      setInitializing(false);
    }
  }, [userLoading, shuffledQuestions.length, setCurrentQuestionIndex, setAnswers, assessmentComplete, isSubmitting]);

  // Save progress whenever answers or current question changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      saveProgress();
    }, 300); // Debounce to prevent too frequent saves
    
    return () => clearTimeout(saveTimeout);
  }, [answers, currentQuestionIndex, saveProgress]);

  // Clear saved progress when assessment is completed
  useEffect(() => {
    if (assessmentComplete) {
      localStorage.removeItem(ASSESSMENT_PROGRESS_KEY);
      console.log("Cleared saved assessment progress due to completion");
    }
  }, [assessmentComplete]);

  // Function to handle finishing the last question
  const handleNextWithCompletion = () => {
    console.log("handleNextWithCompletion called", {
      currentQuestionIndex,
      totalQuestions
    });
    
    if (currentQuestionIndex === totalQuestions - 1) {
      // We're at the last question, so complete the assessment
      console.log("Last question reached, completing assessment");
      setIsSubmitting(true);
      
      // Add a slight delay to prevent infinite loops
      setTimeout(() => {
        completeAssessmentQuestions();
        setIsSubmitting(false);
      }, 50);
    } else {
      // Not at the last question, just go to the next one
      console.log("Moving to next question");
      handleNext();
    }
  };

  // Log states for debugging
  useEffect(() => {
    console.log("Assessment Form State:", {
      loading: initializing || userLoading || shuffledQuestions.length === 0,
      initializing,
      userLoading,
      shuffledQuestionsLength: shuffledQuestions.length,
      currentQuestionId: currentQuestion?.id,
      currentQuestionIndex,
      totalQuestions,
      answersCount: answers.length,
      assessmentComplete,
      isSubmitting
    });
  }, [initializing, userLoading, shuffledQuestions.length, currentQuestion, currentQuestionIndex, totalQuestions, answers.length, assessmentComplete, isSubmitting]);

  return {
    loading: initializing || userLoading || shuffledQuestions.length === 0,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    getCurrentAnswer,
    handleAnswerChange,
    handleNext: handleNextWithCompletion,
    handlePrevious,
    progressPercentage,
    transition,
    assessmentComplete,
    processingPayment: false, // No payment processing yet
    handleDemographicsComplete,
    handleSkipDemographics,
    previousDemographics,
    isSubmitting,
    currentAssessment: tempAssessment // Expose the tempAssessment as currentAssessment
  };
};
