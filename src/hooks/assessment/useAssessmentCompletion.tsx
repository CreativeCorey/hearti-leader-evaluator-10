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
  const [showProcessing, setShowProcessing] = useState(false);

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
    console.log("handleDemographicsComplete called with demographics:", demographics);
    
    if (!tempAssessment) {
      console.error("No temporary assessment found when completing demographics");
      return;
    }
    
    // Validate demographics data
    if (!validateDemographics(demographics)) {
      console.error("Demographics validation failed:", demographics);
      toast({
        title: "Invalid Demographics",
        description: "Demographics data contains invalid values. Please check your inputs.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Demographics validation passed, starting processing sequence");
    
    const finalAssessment: HEARTIAssessment = {
      ...tempAssessment,
      demographics
    };
    
    // Start processing sequence immediately after demographics
    setAssessmentComplete(false);
    setShowProcessing(true);
    
    try {
      console.log("Saving assessment with demographics:", finalAssessment);
      // Save assessment during processing
      await saveAssessment(finalAssessment);
      
      console.log("Assessment saved successfully");
      
      // Processing sequence will complete and call onComplete
      // This is handled in the processing component
      setTempAssessment(finalAssessment);
      
    } catch (error) {
      console.error("Failed to save assessment:", error);
      setShowProcessing(false);
      setAssessmentComplete(true); // Go back to demographics form
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSkipDemographics = async () => {
    if (!tempAssessment) return;
    
    // Start processing sequence for skipped demographics too
    setAssessmentComplete(false);
    setShowProcessing(true);
    
    try {
      // Save assessment during processing
      await saveAssessment(tempAssessment);
      console.log("Assessment without demographics saved successfully");
      
      // Processing sequence will complete and call onComplete
      // This maintains the tempAssessment for processing completion
      
    } catch (error) {
      console.error("Failed to save assessment:", error);
      setShowProcessing(false);
      setAssessmentComplete(true); // Go back to demographics form
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProcessingComplete = () => {
    if (!tempAssessment) return;
    
    console.log("Processing complete, navigating to results");
    setShowProcessing(false);
    setTempAssessment(null);
    
    toast({
      title: "Assessment Complete",
      description: "Your HEARTI™ Leadership assessment results are ready!",
    });
    
    onComplete(tempAssessment);
  };

  return {
    assessmentComplete,
    completeAssessmentQuestions,
    handleDemographicsComplete,
    handleSkipDemographics,
    previousDemographics,
    tempAssessment, // Export the tempAssessment for access in other components
    showProcessing,
    handleProcessingComplete
  };
};
