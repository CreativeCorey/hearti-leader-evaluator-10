import { HEARTIAnswer, HEARTIDimension, HEARTIQuestion, ChartData } from '../types';
import { translations } from '../translations';

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

// Get dimension report content based on status (strength, vulnerability, or neutral)
export function getDimensionReportContent(
  dimension: HEARTIDimension, 
  status: 'strength' | 'vulnerability' | 'neutral',
  userName: string,
  language: string = 'en'
) {
  const t = translations[language as keyof typeof translations] || translations.en;
  
  const content = {
    statusContent: '',
    description: '',
    levels: '',
    tips: ''
  };
  
  // For now, we'll use fallback English content until all dimensions are added to translations
  // This maintains exact same functionality while allowing gradual translation addition
  
  // Check if the translation exists, otherwise use fallback
  const dimensionTranslations = (t as any).dimensions?.[dimension];
  
  if (dimensionTranslations) {
    const statusKey = status === 'strength' ? 'strength' : status === 'vulnerability' ? 'vulnerability' : 'neutral';
    const statusTemplate = dimensionTranslations.status?.[statusKey] || '';
    content.statusContent = statusTemplate.replace('{{userName}}', userName);
    content.description = dimensionTranslations.description || '';
    content.levels = dimensionTranslations.levels || '';
    content.tips = dimensionTranslations.tips || '';
  }
  
  // If no translations exist, use the original English content as fallback
  if (!content.statusContent) {
    // Fall back to original hardcoded content for now
    switch (dimension) {
      case 'humility':
        if (status === 'strength') {
          content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Humility. You are aware of your weaknesses, eager to improve yourself, appreciative of others' strengths, and focused on goals beyond your own self-interest.</p>`;
        } else if (status === 'vulnerability') {
          content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Humility. Humble leaders are aware of their weaknesses, eager to improve themselves, appreciative of others' strengths, and are focused on goals beyond their own self-interest.</p>`;
        } else {
          content.statusContent = `<p class="mb-4">Humble leaders are aware of their weaknesses, eager to improve themselves, appreciative of others' strengths, and are focused on goals beyond their own self-interest.</p>`;
        }
        content.description = `<p class="mb-4">When it comes to leading in the new world of work, being humble means being comfortable that you don't have all the answers, but you possess the courage to learn. This capability is vital for working through diversity, inclusion, equity, and belonging issues. The key here is to start by knowing where you are (and where you aren't...yet).</p><p class="mb-4"><strong>4 Core Elements to Being a Humble Leader:</strong></p><ul class="list-disc pl-5 mb-4"><li>Having an awareness of your limitations</li><li>Understanding that the success of your teams or employees enhance your success</li><li>Operating with a service mindset</li><li>Being driven by a higher purpose</li></ul>`;
        content.levels = `<p class="mb-2"><strong>Best-In-Class:</strong> Humble leaders focus on all stakeholders' needs, asking, "What have I done for others?"</p><p class="mb-2"><strong>Evolving:</strong> Individuals evolving their humble leadership prioritize the company's needs but may not understand the link to stakeholders. They may ask themselves, "What have I done for the organization?"</p><p class="mb-2"><strong>Unready:</strong> Leaders who are unready in humility are self- and personal career-minded, asking, "What have I done for me?"</p>`;
        content.tips = `<p class="mb-2">Being a humble leader requires overcoming a belief in scarcity and replacing it with a growth mindset. To become more familiar with a growth mindset, read Stanford University Professor Carol Dweck's book, Mindset: The New Psychology of Success, or you can watch her TEDTalk.</p><p class="mb-2">Put Dweck's work into practice by adding the word "yet" to every negative statement. For example:</p><ul class="list-disc pl-5 mb-2"><li>"I'm not good at using PowerPoint...yet."</li><li>"I'm not good at public speaking...yet."</li><li>"I'm not good at asking for help...yet."</li></ul><p class="mb-2">If you struggle with micro-managing and perfectionism, enlist your colleagues and/or manager to help identify when you are being overly perfectionistic. Develop a code word or some way to lightly acknowledge the behaviors so you can better recognize patterns and can collaborate to change them.</p><p>Get clear on your "why" when it comes to work and life—having a higher purpose and providing your team with insights into your "why" can enlist them as allies in your goal. Understand their "why," too.</p>`;
        break;
        
      default:
        // For other dimensions, return empty content for now - will be added to translations
        content.statusContent = `<p class="mb-4">Content for ${dimension} dimension will be available in multiple languages soon.</p>`;
        content.description = `<p class="mb-4">Detailed description for ${dimension} coming soon.</p>`;
        content.levels = `<p class="mb-2">Dimension levels information coming soon.</p>`;
        content.tips = `<p class="mb-2">Development tips for ${dimension} coming soon.</p>`;
    }
  }
  
  return content;
}

// Add the missing convertToComparisonFormat function
export const convertToComparisonFormat = (
  userScores: Record<string, number>,
  comparisonScores: Record<string, number> | null
) => {
  const result = [];
  
  // Process each dimension
  for (const dimension in userScores) {
    const entry: any = {
      dimension: dimension.charAt(0).toUpperCase() + dimension.slice(1),
      user: userScores[dimension] || 0,
    };
    
    // Add comparison data if available
    if (comparisonScores) {
      entry.comparison = comparisonScores[dimension] || 0;
    }
    
    result.push(entry);
  }
  
  return result;
};
