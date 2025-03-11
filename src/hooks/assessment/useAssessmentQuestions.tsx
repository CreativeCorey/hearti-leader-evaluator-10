
import { useState, useEffect } from 'react';
import { HEARTIQuestion, HEARTIAnswer } from '@/types';
import { questions } from '@/constants/assessmentQuestions';
import { shuffleArray } from '@/utils/assessmentUtils';
import { useToast } from '@/hooks/use-toast';

export const useAssessmentQuestions = () => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<HEARTIQuestion[]>([]);
  const [answers, setAnswers] = useState<HEARTIAnswer[]>([]);
  const [transition, setTransition] = useState(false);
  
  const totalQuestions = questions.length;
  
  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
  }, []);
  
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

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    setAnswers,
    getCurrentAnswer,
    handleAnswerChange,
    handleNext,
    handlePrevious,
    progressPercentage,
    transition,
    shuffledQuestions
  };
};
