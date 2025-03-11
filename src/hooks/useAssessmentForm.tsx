
import { HEARTIAssessment } from '@/types';
import { useAssessmentQuestions } from './assessment/useAssessmentQuestions';
import { useUserInitialization } from './assessment/useUserInitialization';
import { useAssessmentCompletion } from './assessment/useAssessmentCompletion';
import { useState, useEffect } from 'react';

export const useAssessmentForm = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const [initializing, setInitializing] = useState(true);
  
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

  const { currentUser, loading: userLoading } = useUserInitialization();

  const {
    assessmentComplete,
    processingPayment,
    completeAssessmentQuestions,
    handleDemographicsComplete,
    handleSkipDemographics
  } = useAssessmentCompletion(answers, currentUser, onComplete);

  // Check if initialization is complete
  useEffect(() => {
    if (!userLoading && shuffledQuestions.length > 0) {
      setInitializing(false);
    }
  }, [userLoading, shuffledQuestions.length]);

  // Function to handle finishing the last question
  const handleNextWithCompletion = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      completeAssessmentQuestions();
    } else {
      handleNext();
    }
  };

  // Log states for debugging
  useEffect(() => {
    console.log("Assessment Form State:", {
      loading: initializing || userLoading || shuffledQuestions.length === 0,
      userLoading,
      shuffledQuestionsLength: shuffledQuestions.length,
      currentQuestion: currentQuestion?.id,
      assessmentComplete,
      processingPayment
    });
  }, [initializing, userLoading, shuffledQuestions.length, currentQuestion, assessmentComplete, processingPayment]);

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
    processingPayment,
    handleDemographicsComplete,
    handleSkipDemographics
  };
};
