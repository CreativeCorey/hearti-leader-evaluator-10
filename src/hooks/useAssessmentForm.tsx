
import { HEARTIAssessment } from '@/types';
import { useAssessmentQuestions } from './assessment/useAssessmentQuestions';
import { useUserInitialization } from './assessment/useUserInitialization';
import { useAssessmentCompletion } from './assessment/useAssessmentCompletion';
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export const useAssessmentForm = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const [initializing, setInitializing] = useState(true);
  const { toast } = useToast();
  
  // Initialize assessment questions and user data
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    getCurrentAnswer,
    handleAnswerChange,
    handleNext,
    handlePrevious,
    progressPercentage,
    transition,
    shuffledQuestions
  } = useAssessmentQuestions();

  // Get current user information
  const { currentUser, loading: userLoading } = useUserInitialization();

  // Handle assessment completion
  const {
    assessmentComplete,
    completeAssessmentQuestions,
    handleDemographicsComplete,
    handleSkipDemographics
  } = useAssessmentCompletion(answers, currentUser, onComplete);

  // Check if initialization is complete
  useEffect(() => {
    if (!userLoading && shuffledQuestions.length > 0) {
      console.log("Assessment initialized successfully:", {
        userLoading,
        shuffledQuestionsLength: shuffledQuestions.length,
        userObject: currentUser
      });
      setInitializing(false);
    } else {
      console.log("Assessment still initializing:", {
        userLoading,
        shuffledQuestionsLength: shuffledQuestions.length,
        currentUser
      });
    }
  }, [userLoading, shuffledQuestions.length, currentUser]);

  // Function to handle finishing the last question
  const handleNextWithCompletion = () => {
    console.log("handleNextWithCompletion called", {
      currentQuestionIndex,
      totalQuestions
    });
    
    if (currentQuestionIndex === totalQuestions - 1) {
      // We're at the last question, so complete the assessment
      console.log("Last question reached, completing assessment");
      completeAssessmentQuestions();
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
      assessmentComplete
    });
  }, [initializing, userLoading, shuffledQuestions.length, currentQuestion, currentQuestionIndex, totalQuestions, answers.length, assessmentComplete]);

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
    processingPayment: false, // No payment processing
    handleDemographicsComplete,
    handleSkipDemographics
  };
};
