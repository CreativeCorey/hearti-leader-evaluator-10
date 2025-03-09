
// Validation utilities for type safety
import { HEARTIAnswer, Demographics, HEARTIDimension } from '../../types';
import { Json } from '../../integrations/supabase/types';

export function isValidAnswersArray(answers: Json[]): answers is HEARTIAnswer[] {
  if (!Array.isArray(answers)) {
    return false;
  }
  
  return answers.every(answer => {
    return (
      typeof answer === 'object' && 
      answer !== null &&
      'questionId' in answer &&
      'answerValue' in answer &&
      'dimension' in answer
    );
  });
}

export function isValidDimensionScores(scores: Json): scores is Record<HEARTIDimension, number> {
  if (typeof scores !== 'object' || scores === null) {
    return false;
  }
  
  const dimensions: string[] = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
  
  return dimensions.every(dimension => {
    return (
      dimension in scores &&
      typeof scores[dimension] === 'number'
    );
  });
}

export function isValidDemographics(demographics: Json): demographics is Demographics {
  if (typeof demographics !== 'object' || demographics === null) {
    return false;
  }
  
  // Check for the primary required demographics fields
  const requiredFields = ['age', 'gender', 'role', 'location', 'yearsInRole', 'managementLevel'];
  
  return requiredFields.every(field => field in demographics);
}
