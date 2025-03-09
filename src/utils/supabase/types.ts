
// Validation utilities for type safety
import { HEARTIAnswer, Demographics, HEARTIDimension } from '../../types';
import { Json } from '../../integrations/supabase/types';

// Helper function to check if an object has specific properties
function hasProperties(obj: any, properties: string[]): boolean {
  return properties.every(prop => prop in obj);
}

export function isValidAnswersArray(answers: Json): answers is Json[] {
  if (!Array.isArray(answers)) {
    return false;
  }
  
  return answers.every(answer => {
    return (
      typeof answer === 'object' && 
      answer !== null &&
      hasProperties(answer, ['questionId', 'score', 'dimension'])
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

export function isValidDemographics(demographics: Json): demographics is Json {
  if (typeof demographics !== 'object' || demographics === null) {
    return false;
  }
  
  // Check for the primary required demographics fields
  const requiredFields = ['age', 'gender', 'role', 'location', 'yearsInRole', 'managementLevel'];
  
  return hasProperties(demographics, requiredFields);
}
