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
import { saveAssessment, getCurrentUserAssessments } from '@/utils/localStorage';
import { questions } from '@/constants/assessmentQuestions';
import { useRateLimit } from '@/hooks/useRateLimit';
import { validateAssessmentAnswers, validateDemographics } from '@/utils/input-validation';

export const useAssessmentCompletion = (
  answers: HEARTIAnswer[],
  currentUser: { id: string, organizationId?: string } | null,
  onComplete: (assessment: HEARTIAssessment) => void
) => {
  const { toast } = useToast();
  const { checkAndEnforceRateLimit } = useRateLimit();
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [tempAssessment, setTempAssessment] = useState<HEARTIAssessment | null>(null);
  const [previousDemographics, setPreviousDemographics] = useState<Demographics | undefined>(undefined);

  // Load previous demographics if they exist
  const loadPreviousDemographics = async () => {
    if (!currentUser) return;
    
    try {
      const assessments = await getCurrentUserAssessments();
      if (assessments.length > 0) {
        // Sort by date (newest first)
        const sortedAssessments = [...assessments].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Get the most recent demographics
        if (sortedAssessments[0].demographics) {
          setPreviousDemographics(sortedAssessments[0].demographics);
        }
      }
    } catch (error) {
      console.error("Error loading previous demographics:", error);
    }
  };

  const completeAssessmentQuestions = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User not initialized. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Rate limiting: 5 assessments per hour
    if (!checkAndEnforceRateLimit('assessment_completion', 5, 3600000)) {
      return;
    }
    
    // Ensure we have answers for all questions
    if (answers.length < questions.length) {
      toast({
        title: "Incomplete Assessment",
        description: `Please answer all ${questions.length} questions to complete the assessment.`,
        variant: "destructive"
      });
      return;
    }
    
    // Validate assessment answers format and values
    const answersOnly = answers.map(a => a.score);
    if (!validateAssessmentAnswers(answersOnly)) {
      toast({
        title: "Invalid Assessment Data",
        description: "Assessment contains invalid answers. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Load previous demographics before showing the form
    await loadPreviousDemographics();
    
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
    
    console.log("Assessment completed successfully, displaying demographics form");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemographicsComplete = async (demographics: Demographics) => {
    if (!tempAssessment) return;
    
    // Validate demographics data
    if (!validateDemographics(demographics)) {
      toast({
        title: "Invalid Demographics",
        description: "Demographics data contains invalid values. Please check your inputs.",
        variant: "destructive"
      });
      return;
    }
    
    const finalAssessment: HEARTIAssessment = {
      ...tempAssessment,
      demographics
    };
    
    try {
      // Save assessment directly without any payment processing
      await saveAssessment(finalAssessment);
      onComplete(finalAssessment);
      
      toast({
        title: "Assessment Complete",
        description: "Your assessment has been saved successfully.",
      });
      
      console.log("Assessment with demographics saved successfully");
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
      // Save assessment directly without any payment processing
      await saveAssessment(tempAssessment);
      onComplete(tempAssessment);
      
      toast({
        title: "Assessment Complete",
        description: "Your assessment has been saved successfully.",
      });
      
      console.log("Assessment without demographics saved successfully");
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
    completeAssessmentQuestions,
    handleDemographicsComplete,
    handleSkipDemographics,
    previousDemographics,
    tempAssessment // Export the tempAssessment for access in other components
  };
};
