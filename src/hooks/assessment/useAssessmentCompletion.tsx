
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  HEARTIQuestion, 
  HEARTIAnswer, 
  HEARTIAssessment,
  Demographics
} from '@/types';
import { calculateDimensionScores, calculateOverallScore } from '@/utils/calculations';
import { saveAssessment } from '@/utils/localStorage';
import { questions } from '@/constants/assessmentQuestions';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';

export const useAssessmentCompletion = (
  answers: HEARTIAnswer[],
  currentUser: { id: string, organizationId?: string } | null,
  onComplete: (assessment: HEARTIAssessment) => void
) => {
  const { toast } = useToast();
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [tempAssessment, setTempAssessment] = useState<HEARTIAssessment | null>(null);
  
  const { processingPayment, redirectToStripePayment } = useAssessmentPayment(onComplete);

  const completeAssessmentQuestions = () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User not initialized. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }
    
    const finalAnswers = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question?.reverseScored) {
        return { ...answer, score: 6 - answer.score };
      }
      return answer;
    });

    const dimensionScores = calculateDimensionScores(finalAnswers, questions);
    const overallScore = calculateOverallScore(dimensionScores);
    
    const assessment: HEARTIAssessment = {
      id: uuidv4(),
      userId: currentUser.id,
      organizationId: currentUser.organizationId,
      date: new Date().toISOString(),
      answers: finalAnswers,
      dimensionScores,
      overallScore
    };
    
    setTempAssessment(assessment);
    setAssessmentComplete(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemographicsComplete = async (demographics: Demographics) => {
    if (!tempAssessment) return;
    
    const finalAssessment: HEARTIAssessment = {
      ...tempAssessment,
      demographics
    };
    
    try {
      // Save temporarily, but redirect to payment before showing results
      await saveAssessment(finalAssessment);
      
      // Redirect to Stripe payment flow instead of completing directly
      redirectToStripePayment(finalAssessment);
      
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSkipDemographics = async () => {
    if (!tempAssessment) return;
    
    try {
      // Save temporarily, but redirect to payment before showing results
      await saveAssessment(tempAssessment);
      
      // Redirect to Stripe payment flow instead of completing directly
      redirectToStripePayment(tempAssessment);
      
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    assessmentComplete,
    processingPayment,
    completeAssessmentQuestions,
    handleDemographicsComplete,
    handleSkipDemographics
  };
};
