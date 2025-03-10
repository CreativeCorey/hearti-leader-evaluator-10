
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { HEARTIAssessment } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    handleDemographicsComplete,
    handleSkipDemographics
  } = useAssessmentForm(onComplete);

  if (loading || !currentQuestion) {
    return <div className="flex justify-center p-6">Loading assessment questions...</div>;
  }

  if (assessmentComplete) {
    return (
      <DemographicForm 
        onComplete={handleDemographicsComplete} 
        onSkip={handleSkipDemographics} 
      />
    );
  }

  const currentScore = getCurrentAnswer();

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm">
      <CardHeader className="relative pb-0">
        <div className="h-1 w-full bg-orange/20 absolute top-0 left-0 right-0">
          <div 
            className="h-full bg-purple transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <CardTitle className="text-2xl">
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
      <CardFooter className="flex justify-between border-t p-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        
        <div className="text-sm text-muted-foreground font-medium">
          {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        
        <Button 
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Complete' : 'Next'} 
          {currentQuestionIndex !== totalQuestions - 1 && <ArrowRight className="h-4 w-4" />}
        </Button>
      </CardFooter>
      
      {DEBUG && <DebugTools />}
    </Card>
  );
};

export default AssessmentForm;
