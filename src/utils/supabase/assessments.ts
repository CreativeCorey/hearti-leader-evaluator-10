
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
    date: assessment.created_at,
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
      age: '',
      gender: '',
      race: '',
      role: '',
      location: '',
      yearsInRole: '',
      companySize: '',
      industry: '',
      managementLevel: ''
    }
  };

  // Safely parse the answers array
  if (assessment.answers && isValidAnswersArray(assessment.answers)) {
    parsedAssessment.answers = assessment.answers;
  }

  // Safely parse the dimension scores
  if (assessment.dimension_scores && isValidDimensionScores(assessment.dimension_scores)) {
    parsedAssessment.dimensionScores = assessment.dimension_scores;
  }

  // Parse overall score
  if (typeof assessment.overall_score === 'number') {
    parsedAssessment.overallScore = assessment.overall_score;
  }

  // Safely parse demographics
  if (assessment.demographics && isValidDemographics(assessment.demographics)) {
    parsedAssessment.demographics = assessment.demographics;
  }

  return parsedAssessment;
}

export async function fetchUserAssessments(userId: string): Promise<HEARTIAssessment[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
      .order('created_at', { ascending: false });

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
      .order('created_at', { ascending: false })
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

export async function saveAssessment(assessment: HEARTIAssessment): Promise<string> {
  try {
    // Convert from our frontend model to the database model
    const dbAssessment = {
      id: assessment.id,
      user_id: assessment.userId,
      organization_id: assessment.organizationId,
      answers: assessment.answers,
      dimension_scores: assessment.dimensionScores,
      overall_score: assessment.overallScore,
      demographics: assessment.demographics,
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
