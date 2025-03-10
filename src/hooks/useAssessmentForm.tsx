
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  HEARTIQuestion, 
  HEARTIAnswer, 
  HEARTIAssessment,
  Demographics
} from '@/types';
import { calculateDimensionScores, calculateOverallScore } from '@/utils/calculations';
import { saveAssessment, ensureUserExists } from '@/utils/localStorage';
import { questions } from '@/constants/assessmentQuestions';
import { shuffleArray } from '@/utils/assessmentUtils';

export const useAssessmentForm = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<HEARTIQuestion[]>([]);
  const [answers, setAnswers] = useState<HEARTIAnswer[]>([]);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [tempAssessment, setTempAssessment] = useState<HEARTIAssessment | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string, organizationId?: string } | null>(null);
  const [transition, setTransition] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const totalQuestions = questions.length;
  
  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
    
    // Initialize user
    const initUser = async () => {
      console.log("Initializing user, checking if exists...");
      try {
        const user = await ensureUserExists();
        setCurrentUser({
          id: user.id,
          organizationId: user.organizationId
        });
      } catch (error) {
        console.error("Failed to get user:", error);
        toast({
          title: "Error",
          description: "Failed to initialize user. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    initUser();
  }, [toast]);
  
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerChange = (score: number) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === currentQuestion.id);
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId: currentQuestion.id, score };
        return newAnswers;
      }
      return [...prev, { questionId: currentQuestion.id, score }];
    });
  };

  const getCurrentAnswer = (): number => {
    if (!currentQuestion) return 3; // Default to middle value
    
    const existingAnswer = answers.find(a => a.questionId === currentQuestion.id);
    return existingAnswer ? existingAnswer.score : 3;
  };

  const handleNext = () => {
    // Ensure current question is answered
    if (!answers.some(a => a.questionId === currentQuestion?.id)) {
      toast({
        title: "Please answer the question",
        description: "Please select a value on the slider to continue.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setTransition(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setTransition(false);
      }, 150);
    } else {
      completeAssessmentQuestions();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setTransition(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setTransition(false);
      }, 150);
    }
  };

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
      await saveAssessment(finalAssessment);
      onComplete(finalAssessment);
      
      toast({
        title: "Assessment completed!",
        description: "Your HEARTI leadership assessment has been saved with demographics.",
      });
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
      await saveAssessment(tempAssessment);
      onComplete(tempAssessment);
      
      toast({
        title: "Assessment completed!",
        description: "Your HEARTI leadership assessment has been saved.",
      });
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return {
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
  };
};
