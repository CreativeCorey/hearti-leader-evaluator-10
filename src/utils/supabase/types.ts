
import { HEARTIAnswer, HEARTIDimension, Demographics } from '../types';
import { Json } from '../../integrations/supabase/types';

// Type guards to ensure safe conversion from Json to application types
export function isValidAnswersArray(data: any): data is HEARTIAnswer[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 'questionId' in item && 'score' in item
  );
}

export function isValidDimensionScores(data: any): data is Record<HEARTIDimension, number> {
  if (typeof data !== 'object' || data === null) return false;
  
  const validDimensions = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
  return validDimensions.every(dim => dim in data && typeof data[dim] === 'number');
}

export function isValidDemographics(data: any): data is Demographics {
  return typeof data === 'object' && data !== null;
}
