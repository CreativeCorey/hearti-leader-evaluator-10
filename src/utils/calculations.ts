
import { HEARTIAnswer, HEARTIDimension, HEARTIQuestion, ChartData } from '../types';

// Calculate scores for each dimension
export const calculateDimensionScores = (
  answers: HEARTIAnswer[],
  questions: HEARTIQuestion[]
): Record<HEARTIDimension, number> => {
  const dimensionCounts: Record<HEARTIDimension, number> = {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0,
  };

  const dimensionScores: Record<HEARTIDimension, number> = {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0,
  };

  // Sum the scores for each dimension
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question) {
      dimensionScores[question.dimension] += answer.score;
      dimensionCounts[question.dimension]++;
    }
  });

  // Calculate the average score for each dimension (out of 5)
  const dimensions: HEARTIDimension[] = [
    'humility',
    'empathy',
    'accountability',
    'resiliency',
    'transparency',
    'inclusivity',
  ];

  dimensions.forEach((dimension) => {
    if (dimensionCounts[dimension] > 0) {
      dimensionScores[dimension] = Number(
        (dimensionScores[dimension] / dimensionCounts[dimension]).toFixed(1)
      );
    }
  });

  return dimensionScores;
};

// Calculate overall score
export const calculateOverallScore = (
  dimensionScores: Record<HEARTIDimension, number>
): number => {
  const dimensions = Object.keys(dimensionScores) as HEARTIDimension[];
  const sum = dimensions.reduce((acc, dimension) => acc + dimensionScores[dimension], 0);
  return Number((sum / dimensions.length).toFixed(1));
};

// Format dimension data for radar chart
export const formatDataForRadarChart = (
  dimensionScores: Record<HEARTIDimension, number>
): ChartData => {
  return [
    { name: 'Humility', value: dimensionScores.humility, fullMark: 5 },
    { name: 'Empathy', value: dimensionScores.empathy, fullMark: 5 },
    { name: 'Accountability', value: dimensionScores.accountability, fullMark: 5 },
    { name: 'Resiliency', value: dimensionScores.resiliency, fullMark: 5 },
    { name: 'Transparency', value: dimensionScores.transparency, fullMark: 5 },
    { name: 'Inclusivity', value: dimensionScores.inclusivity, fullMark: 5 },
  ];
};

// Get dimension description
export const getDimensionDescription = (dimension: HEARTIDimension): string => {
  const descriptions: Record<HEARTIDimension, string> = {
    humility: 'The ability to recognize one\'s limitations and mistakes, and to be open to feedback and growth.',
    empathy: 'The capacity to understand and share the feelings of others, and to respond with compassion.',
    accountability: 'The willingness to take responsibility for one\'s actions and decisions, and to follow through on commitments.',
    resiliency: 'The ability to recover from setbacks, adapt to change, and keep going in the face of adversity.',
    transparency: 'The practice of being open, honest, and clear in communications and decision-making processes.',
    inclusivity: 'The commitment to creating environments where all people feel welcomed, respected, and valued.',
  };

  return descriptions[dimension];
};

// Get feedback based on score
export const getFeedback = (score: number, dimension: HEARTIDimension): string => {
  if (score >= 4.5) {
    return `Your ${dimension} score is excellent. This is a significant strength in your leadership style.`;
  } else if (score >= 3.5) {
    return `Your ${dimension} score is good. This is a positive aspect of your leadership with room for further development.`;
  } else if (score >= 2.5) {
    return `Your ${dimension} score is average. Consider focusing on developing this aspect of your leadership.`;
  } else {
    return `Your ${dimension} score is below average. This area represents an opportunity for significant growth.`;
  }
};
