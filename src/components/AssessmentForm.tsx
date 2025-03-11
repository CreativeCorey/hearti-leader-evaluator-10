
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import DemographicForm from './DemographicForm';
import QuestionDisplay from './assessment/QuestionDisplay';
import DebugTools from './assessment/DebugTools';
import { useAssessmentForm } from '@/hooks/useAssessmentForm';

interface AssessmentFormProps {
  onComplete: (assessment: HEARTIAssessment) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const isMobile = useIsMobile();
  const DEBUG = import.meta.env.DEV;
  
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
    handleSkipDemographics
  } = useAssessmentForm(onComplete);

  // Loading state while initializing form
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading assessment questions...</p>
      </div>
    );
  }

  // Error state if no questions loaded
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-red-500">Error: Could not load questions.</p>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }

  // Payment processing state
  if (processingPayment) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-white rounded-lg shadow-md">
        <CreditCard className="h-12 w-12 text-primary animate-pulse" />
        <h2 className="text-2xl font-bold text-center">Processing Payment</h2>
        <p className="text-center text-muted-foreground">
          Please wait while we redirect you to complete your payment.
          Your assessment results will be unlocked once payment is complete.
        </p>
        <Loader2 className="h-8 w-8 animate-spin text-primary mt-4" />
      </div>
    );
  }

  // Demographics form after assessment completion
  if (assessmentComplete) {
    return (
      <DemographicForm 
        onComplete={handleDemographicsComplete} 
        onSkip={handleSkipDemographics} 
      />
    );
  }

  // Main assessment form
  const currentScore = getCurrentAnswer();

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
          HEARTI Leadership Assessment
        </CardTitle>
        <CardDescription>
          Answer each question based on how frequently you exhibit the described behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-4">
          <div className="text-center mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          <QuestionDisplay
            question={currentQuestion}
            currentScore={currentScore}
            onAnswerChange={handleAnswerChange}
            isMobile={isMobile}
            transition={transition}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 sm:p-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> Previous
        </Button>
        
        <div className="text-xs sm:text-sm text-muted-foreground font-medium">
          {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        
        <Button 
          onClick={handleNext}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          size={isMobile ? "sm" : "default"}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Complete' : 'Next'} 
          {currentQuestionIndex !== totalQuestions - 1 && <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />}
        </Button>
      </CardFooter>
      
      {DEBUG && <DebugTools />}
    </Card>
  );
};

export default AssessmentForm;
