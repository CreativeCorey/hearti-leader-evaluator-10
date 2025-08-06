import { HEARTIQuestion, HEARTIAnswer, DimensionScores } from '@/types';
import { questions } from '@/constants/assessmentQuestions';

// Shuffle array utility
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Select 6 random questions for pulse test (1 from each dimension)
export const selectPulseTestQuestions = (): HEARTIQuestion[] => {
  const dimensions = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
  const selectedQuestions: HEARTIQuestion[] = [];

  dimensions.forEach(dimension => {
    const dimensionQuestions = questions.filter(q => q.dimension === dimension);
    const shuffled = shuffleArray(dimensionQuestions);
    selectedQuestions.push(shuffled[0]);
  });

  return shuffledArray(selectedQuestions);
};

// Calculate dimension scores for pulse test
export const calculatePulseTestScores = (answers: HEARTIAnswer[], selectedQuestions: HEARTIQuestion[]): { dimensionScores: DimensionScores; overallScore: number } => {
  const dimensionScores: DimensionScores = {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0,
  };

  // Calculate scores for each dimension based on the pulse test answers
  selectedQuestions.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (answer) {
      let score = answer.score;
      
      // Apply reverse scoring if needed
      if (question.reverseScored) {
        score = 6 - score;
      }
      
      const dimension = question.dimension as keyof DimensionScores;
      dimensionScores[dimension] = score;
    }
  });

  // Calculate overall score as average of dimension scores
  const scores = Object.values(dimensionScores);
  const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  return { dimensionScores, overallScore };
};

// Check if it's time for a pulse test (60 days from last assessment)
export const shouldShowPulseTest = (lastAssessmentDate: string): boolean => {
  const lastDate = new Date(lastAssessmentDate);
  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysDifference >= 60;
};

// Check if it's time for a full assessment (360 days from initial)
export const shouldShowFullAssessment = (initialAssessmentDate: string): boolean => {
  const initialDate = new Date(initialAssessmentDate);
  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysDifference >= 360;
};

// Calculate next pulse and full assessment dates
export const calculateNextDates = (lastAssessmentDate: string) => {
  const lastDate = new Date(lastAssessmentDate);
  
  const nextPulseDate = new Date(lastDate);
  nextPulseDate.setDate(nextPulseDate.getDate() + 60);
  
  const nextFullDate = new Date(lastDate);
  nextFullDate.setDate(nextFullDate.getDate() + 360);
  
  return {
    nextPulseDate: nextPulseDate.toISOString(),
    nextFullAssessmentDate: nextFullDate.toISOString()
  };
};

// Helper function that was missing
const shuffledArray = <T>(array: T[]): T[] => {
  return shuffleArray(array);
};