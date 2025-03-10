
import { supabase } from '../../integrations/supabase/client';
import { HEARTIAssessment, HEARTIDimension, HEARTIAnswer, Demographics } from '../../types';
import { Json } from '../../integrations/supabase/types';
import { isValidAnswersArray, isValidDimensionScores, isValidDemographics } from './types';

// Type guard to convert Supabase assessment data to HEARTIAssessment
function parseAssessment(assessment: any): HEARTIAssessment {
  const parsedAssessment: HEARTIAssessment = {
    id: assessment.id,
    userId: assessment.user_id,
    organizationId: assessment.organization_id || '',
    date: assessment.date || new Date().toISOString(), // Use date field instead of created_at
    answers: [],
    dimensionScores: {
      humility: 0,
      empathy: 0,
      accountability: 0,
      resiliency: 0,
      transparency: 0,
      inclusivity: 0
    },
    overallScore: 0,
    demographics: {
      managementLevel: assessment.demographics?.managementLevel || undefined,
      companySize: assessment.demographics?.companySize || undefined,
      jobRole: assessment.demographics?.jobRole || undefined,
      location: assessment.demographics?.location || undefined,
      ageRange: assessment.demographics?.ageRange || undefined,
      genderIdentity: assessment.demographics?.genderIdentity || undefined,
      raceEthnicity: assessment.demographics?.raceEthnicity || undefined
    }
  };

  // Safely parse the answers array
  if (assessment.answers && isValidAnswersArray(assessment.answers)) {
    parsedAssessment.answers = assessment.answers as any;
  }

  // Safely parse the dimension scores
  if (assessment.dimension_scores && isValidDimensionScores(assessment.dimension_scores)) {
    parsedAssessment.dimensionScores = assessment.dimension_scores as any;
  }

  // Parse overall score
  if (typeof assessment.overall_score === 'number') {
    parsedAssessment.overallScore = assessment.overall_score;
  }

  // Safely parse demographics
  if (assessment.demographics && isValidDemographics(assessment.demographics)) {
    parsedAssessment.demographics = assessment.demographics as any;
  }

  return parsedAssessment;
}

export async function fetchUserAssessments(userId: string): Promise<HEARTIAssessment[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false }); // Use date field instead of created_at

    if (error) {
      throw new Error(`Error fetching assessments: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Parse and convert data to HEARTIAssessment
    return data.map(parseAssessment);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
}

export async function fetchAssessmentsByOrganization(organizationId: string): Promise<HEARTIAssessment[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('organization_id', organizationId)
      .order('date', { ascending: false }); // Use date field instead of created_at

    if (error) {
      throw new Error(`Error fetching organization assessments: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Parse and convert data to HEARTIAssessment
    return data.map(parseAssessment);
  } catch (error) {
    console.error('Error fetching organization assessments:', error);
    return [];
  }
}

export async function fetchRecentAssessments(limit = 100): Promise<HEARTIAssessment[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('date', { ascending: false }) // Use date field instead of created_at
      .limit(limit);

    if (error) {
      throw new Error(`Error fetching recent assessments: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Parse and convert data to HEARTIAssessment
    return data.map(parseAssessment);
  } catch (error) {
    console.error('Error fetching recent assessments:', error);
    return [];
  }
}

// Added these functions to match what's imported in localStorage.ts
export async function saveAssessmentToSupabase(assessment: HEARTIAssessment): Promise<boolean> {
  try {
    await saveAssessment(assessment);
    return true;
  } catch (error) {
    console.error('Error saving assessment to Supabase:', error);
    return false;
  }
}

export async function getUserAssessmentsFromSupabase(userId: string): Promise<HEARTIAssessment[]> {
  return await fetchUserAssessments(userId);
}

export async function saveAssessment(assessment: HEARTIAssessment): Promise<string> {
  try {
    // Convert from our frontend model to the database model
    const dbAssessment = {
      id: assessment.id,
      user_id: assessment.userId,
      organization_id: assessment.organizationId,
      date: assessment.date, // Ensure date is properly stored
      answers: assessment.answers as unknown as Json,
      dimension_scores: assessment.dimensionScores as unknown as Json,
      overall_score: assessment.overallScore,
      demographics: assessment.demographics as unknown as Json,
    };

    const { data, error } = await supabase
      .from('assessments')
      .upsert(dbAssessment)
      .select('id')
      .single();

    if (error) {
      throw new Error(`Error saving assessment: ${error.message}`);
    }

    return data.id;
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
}

export async function saveAssessmentAndSyncToSheet(assessment: HEARTIAssessment): Promise<string> {
  try {
    // First save the assessment to Supabase
    const assessmentId = await saveAssessment(assessment);
    
    // Then call the Supabase Edge Function to sync to Google Sheets
    const { data, error } = await supabase.functions.invoke('sync-assessment-to-sheet', {
      body: { assessmentId }
    });
    
    if (error) {
      console.error('Error syncing to Google Sheets:', error);
      // We don't throw here because the assessment was successfully saved
    }
    
    return assessmentId;
  } catch (error) {
    console.error('Error in saveAssessmentAndSyncToSheet:', error);
    throw error;
  }
}
