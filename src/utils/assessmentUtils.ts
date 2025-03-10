
import { HEARTIQuestion } from '../types';

// Shuffle questions for randomized assessment
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get label for a score value
export const getScoreLabel = (score: number): string => {
  switch (score) {
    case 1: return "Nearly Never";
    case 2: return "Rarely";
    case 3: return "Sometimes";
    case 4: return "Frequently";
    case 5: return "Almost Always";
    default: return "";
  }
};

// Standard score options for the assessment
export const scoreLabels = [
  { value: 1, label: "Nearly Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Frequently" },
  { value: 5, label: "Almost Always" },
];
