
import React, { useState, useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import DemographicForm from './DemographicForm';
import QuestionDisplay from './assessment/QuestionDisplay';
import DebugTools from './assessment/DebugTools';
import { useAssessmentForm } from '@/hooks/useAssessmentForm';
import { useLanguage } from '@/contexts/language/LanguageContext';
import AssessmentLoadingState from './assessment/AssessmentLoadingState';

interface AssessmentFormProps {
  onComplete: (assessment: HEARTIAssessment) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const isMobile = useIsMobile();
  const DEBUG = import.meta.env.DEV;
  const { t } = useLanguage();
  const [showLoadingState, setShowLoadingState] = useState(false);
  const [loadingStateComplete, setLoadingStateComplete] = useState(false);
  
  const {
    loading,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    getCurrentAnswer,
    handleAnswerChange,
    handleNext,
    handlePrevious,
    progressPercentage,
    transition,
    assessmentComplete,
    processingPayment,
    handleDemographicsComplete,
    handleSkipDemographics,
    previousDemographics,
    isSubmitting
  } = useAssessmentForm((assessment) => {
    // Show loading state only at assessment completion
    if (currentQuestionIndex === totalQuestions - 1 && !loadingStateComplete) {
      setShowLoadingState(true);
      // This will be triggered when loading animation completes
    } else {
      onComplete(assessment);
    }
  });

  // Handle loading state completion
  useEffect(() => {
    if (loadingStateComplete && assessmentComplete) {
      // This ensures we only call onComplete after the loading animation finishes
      const timer = setTimeout(() => {
        onComplete(assessment => assessment);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loadingStateComplete, assessmentComplete, onComplete]);

  // Loading state while initializing form
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  // Error state if no questions loaded
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-red-500">{t('common.error')}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">{t('assessment.reload')}</Button>
      </div>
    );
  }

  // Show loading state before demographics
  if (showLoadingState) {
    return (
      <AssessmentLoadingState 
        onComplete={() => {
          setLoadingStateComplete(true);
          setShowLoadingState(false);
        }}
      />
    );
  }

  // Demographics form after assessment completion
  if (assessmentComplete) {
    return (
      <DemographicForm 
        onComplete={handleDemographicsComplete} 
        onSkip={handleSkipDemographics}
        existingDemographics={previousDemographics}
      />
    );
  }

  // Main assessment form
  const currentScore = getCurrentAnswer();

  // Handle completing the assessment and showing loading state
  const handleCompleteAssessment = () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (currentQuestionIndex === totalQuestions - 1) {
      // Save the current answer and then show loading state
      handleNext();
    } else {
      handleNext();
    }
  };

  return (
    <Card className="w-full mx-auto shadow-sm">
      <CardHeader className="relative pb-0">
        <div className="h-1 w-full bg-orange/20 absolute top-0 left-0 right-0">
          <div 
            className="h-full bg-purple transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <CardTitle className="text-xl sm:text-2xl">
          {t('assessment.title')}
        </CardTitle>
        <CardDescription>
          {t('assessment.instructions')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 py-4">
          <div className="text-center mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {t('assessment.questionCount', { current: String(currentQuestionIndex + 1), total: String(totalQuestions) })}
            </span>
          </div>
          
          <div className="question-display-wrapper min-h-[280px] flex items-center">
            <QuestionDisplay
              question={currentQuestion}
              currentScore={currentScore}
              onAnswerChange={handleAnswerChange}
              isMobile={isMobile}
              transition={transition}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 sm:p-6 sticky bottom-0 bg-white">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> {t('common.previous')}
        </Button>
        
        <div className="text-xs sm:text-sm text-muted-foreground font-medium">
          {currentQuestionIndex + 1} {t('assessment.of')} {totalQuestions}
        </div>
        
        <Button 
          onClick={handleCompleteAssessment}
          disabled={isSubmitting}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
              {t('common.processing')}
            </>
          ) : (
            <>
              {currentQuestionIndex === totalQuestions - 1 ? t('common.complete') : t('common.next')}
              {currentQuestionIndex !== totalQuestions - 1 && <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />}
            </>
          )}
        </Button>
      </CardFooter>
      
      {DEBUG && <DebugTools />}
    </Card>
  );
};

export default AssessmentForm;
