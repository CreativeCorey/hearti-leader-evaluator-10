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
  
  // Try to get translations from the specific language
  const dimensionTranslation = (t as any).dimensions?.[dimension];
  
  if (dimensionTranslation) {
    // Handle status content
    if (dimensionTranslation.status) {
      const statusKey = status === 'strength' ? 'strength' : status === 'vulnerability' ? 'vulnerability' : 'neutral';
      const statusTemplate = dimensionTranslation.status[statusKey] || '';
      content.statusContent = statusTemplate.replace(/\{\{userName\}\}/g, userName);
    }
    
    // Handle description, levels, and tips
    content.description = dimensionTranslation.description || '';
    content.levels = dimensionTranslation.levels || '';
    content.tips = dimensionTranslation.tips || '';
  }
  
  // If no translations exist, use the English content as fallback
  if (!content.statusContent && !content.description) {
    // Check if we have English translations first
    const englishDimension = translations.en.dimensions?.[dimension];
    
    if (englishDimension) {
      // Use English translations
      const statusKey = status === 'strength' ? 'strength' : status === 'vulnerability' ? 'vulnerability' : 'neutral';
      content.statusContent = englishDimension.status[statusKey].replace(/\{\{userName\}\}/g, userName);
      content.description = englishDimension.description;
      content.levels = englishDimension.levels;
      content.tips = englishDimension.tips;
    } else {
      // Fallback to hardcoded content for dimensions not yet in translations
      switch (dimension) {
        case 'empathy':
          if (status === 'strength') {
            content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Empathy. You can understand others' feelings, needs, and motivations effectively.</p>`;
          } else if (status === 'vulnerability') {
            content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Empathy. Empathetic leaders can understand others' feelings, needs, and motivations effectively.</p>`;
          } else {
            content.statusContent = `<p class="mb-4">Empathetic leaders can understand others' feelings, needs, and motivations effectively.</p>`;
          }
          content.description = `<p class="mb-4">Empathetic leaders are able to understand the feelings, needs, and motivations of others. Based on curiosity and learning, you also tend to be good at active listening and enjoy helping others grow and develop.</p>`;
          content.levels = `<p class="mb-2"><strong>Best-In-Class:</strong> Best-in-class empathetic leaders take responsibility for effectively connecting with others.</p><p class="mb-2"><strong>Evolving:</strong> Individuals evolving empathy recognize its value but may not truly understand how to authentically connect with others.</p><p class="mb-2"><strong>Unready:</strong> Leaders who are unready in empathy do not recognize the value of empathetic behaviors.</p>`;
          content.tips = `<p class="mb-2">Challenge yourself with experiences that push you out of your comfort zone. Learn new skills that will make you humble, as humility is a true empathy driver.</p><p class="mb-2">Seek feedback from family, friends, and colleagues about your relationship skills, then check in regularly on your progress.</p><p class="mb-2">Cultivate your curiosity and ask better questions in every conversation.</p>`;
          break;
          
        case 'accountability':
          if (status === 'strength') {
            content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Accountability. You dare to make unpopular decisions and take responsibility for actions and outcomes.</p>`;
          } else if (status === 'vulnerability') {
            content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Accountability. Accountable leaders dare to make unpopular decisions and take responsibility for actions and outcomes.</p>`;
          } else {
            content.statusContent = `<p class="mb-4">Accountable leaders dare to make unpopular decisions and take responsibility for actions and outcomes.</p>`;
          }
          content.description = `<p class="mb-4">Accountable leaders dare to make unpopular decisions and are willing to be responsible for their own and others' actions and decisions. They communicate what they are going to do, work with others for support, and deliver as promised.</p>`;
          content.levels = `<p class="mb-2"><strong>Best-In-Class:</strong> Best-in-class accountable leaders use tools like strategic planning and cascading goals to outline individual and team accountabilities.</p><p class="mb-2"><strong>Evolving:</strong> Individuals developing accountable leadership may work with individuals and teams to clearly define roles but may be inconsistent in holding people accountable.</p><p class="mb-2"><strong>Unready:</strong> Leaders who are unready in accountability focus on the individual. They may lack understanding of cross-team interdependencies.</p>`;
          content.tips = `<p class="mb-2">Build trust through reliability, accountability, integrity, and generosity. Start measuring what matters and create governance plans that address both direct priorities and inclusive culture.</p>`;
          break;
          
        case 'resiliency':
          if (status === 'strength') {
            content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Resiliency. You persist through challenges with flexibility and inspire others to continue toward shared goals.</p>`;
          } else if (status === 'vulnerability') {
            content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Resiliency. Resilient leaders persist through challenges with flexibility and inspire others to continue toward shared goals.</p>`;
          } else {
            content.statusContent = `<p class="mb-4">Resilient leaders persist through challenges with flexibility and inspire others to continue toward shared goals.</p>`;
          }
          content.description = `<p class="mb-4">Resilient leaders are able to persist through challenges with flexibility. They inspire others to continue toward shared goals and can outmaneuver competition through strategic, flexible responses to challenges.</p>`;
          content.levels = `<p class="mb-2"><strong>Best-In-Class:</strong> Best-in-class resilient leaders cultivate and value resilience in their followers and teams.</p><p class="mb-2"><strong>Evolving:</strong> Individuals developing resilient leadership recognize the need for resilience but may not have performance measures and processes to capture learning.</p><p class="mb-2"><strong>Unready:</strong> Leaders who are unready in resiliency may punish individuals for team shortcomings and lack processes for capturing learning.</p>`;
          content.tips = `<p class="mb-2">Practice mindfulness through journaling, yoga, and spiritual practices. Take small risks and try new things monthly. Acknowledge challenges and break them into smaller goals.</p>`;
          break;
          
        case 'transparency':
          if (status === 'strength') {
            content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Transparency. You understand that sharing information is critical to individual and team success.</p>`;
          } else if (status === 'vulnerability') {
            content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Transparency. Transparent leaders understand that sharing information is critical to individual and team success.</p>`;
          } else {
            content.statusContent = `<p class="mb-4">Transparent leaders understand that sharing information is critical to individual and team success.</p>`;
          }
          content.description = `<p class="mb-4">Transparent leaders understand that sharing information is critical to individual and team success. They know that communication is the foundation of building trust and are not afraid to share information that may be uncomfortable or represent opposing views.</p>`;
          content.levels = `<p class="mb-2"><strong>Best-In-Class:</strong> Transparent leaders understand that clear communication is critical and know when to share what information appropriately.</p><p class="mb-2"><strong>Evolving:</strong> Individuals developing transparent leadership understand the importance of communication but may be inconsistent across teams and uncomfortable knowing what to share.</p><p class="mb-2"><strong>Unready:</strong> Leaders who are unready in transparency may withhold communication to maintain status, hierarchy, or perceived control.</p>`;
          content.tips = `<p class="mb-2">Adopt an open-door policy, get to know your employees personally, always be honest, and address difficult situations promptly to maintain trust and morale.</p>`;
          break;
          
        case 'inclusivity':
          if (status === 'strength') {
            content.statusContent = `<p class="mb-4"><strong>Congratulations!</strong> ${userName}, your HEARTI:Leader strength is Inclusivity. You are a champion of differences and understand that diverse teams drive more significant innovation.</p>`;
          } else if (status === 'vulnerability') {
            content.statusContent = `<p class="mb-4">${userName}, an area of growth for you is Inclusivity. Inclusive leaders are champions of differences and understand that diverse teams drive more significant innovation.</p>`;
          } else {
            content.statusContent = `<p class="mb-4">Inclusive leaders are champions of differences and understand that diverse teams drive more significant innovation.</p>`;
          }
          content.description = `<p class="mb-4">Inclusive leaders are champions of differences and understand that diverse teams drive more significant innovation and better outcomes. Being an inclusive leader is about understanding dynamics related to belonging, listening to all voices, considering all ideas, and giving credit where credit is due.</p>`;
          content.levels = `<p class="mb-2"><strong>Best-In-Class:</strong> Champions of belonging advocate for creating a workplace grounded in diversity, equity, and inclusion with supporting systems, processes, and culture.</p><p class="mb-2"><strong>Evolving:</strong> Evolving leaders are aware of the importance of diversity, equity, and inclusion but lack advocacy and accountability.</p><p class="mb-2"><strong>Unready:</strong> Unready leaders are scarcity-driven and may lack basic systems, processes, and culture for tracking progress and advocacy.</p>`;
          content.tips = `<p class="mb-2">Read books on inclusive leadership, take time to build anti-racism insights and skills, understand your privilege, and become a better ally in the workplace.</p>`;
          break;
          
        default:
          content.statusContent = `<p class="mb-4">Content for ${dimension} dimension will be available in multiple languages soon.</p>`;
          content.description = `<p class="mb-4">Detailed description for ${dimension} coming soon.</p>`;
          content.levels = `<p class="mb-2">Dimension levels information coming soon.</p>`;
          content.tips = `<p class="mb-2">Development tips for ${dimension} coming soon.</p>`;
      }
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
