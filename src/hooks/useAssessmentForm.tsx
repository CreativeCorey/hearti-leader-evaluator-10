
import { HEARTIAssessment } from '@/types';
import { useAssessmentQuestions } from './assessment/useAssessmentQuestions';
import { useUserInitialization } from './assessment/useUserInitialization';
import { useAssessmentCompletion } from './assessment/useAssessmentCompletion';

export const useAssessmentForm = (onComplete: (assessment: HEARTIAssessment) => void) => {
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

  const { currentUser, loading } = useUserInitialization();

  const {
    assessmentComplete,
    processingPayment,
    completeAssessmentQuestions,
    handleDemographicsComplete,
    handleSkipDemographics
  } = useAssessmentCompletion(answers, currentUser, onComplete);

  // Function to handle finishing the last question
  const handleNextWithCompletion = () => {
    if (currentQuestionIndex === totalQuestions - 1) {
      completeAssessmentQuestions();
    } else {
      handleNext();
    }
  };

  return {
    loading,
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
