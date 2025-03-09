
import { supabase } from '../../integrations/supabase/client';
import { HEARTIAssessment } from '../../types';
import { Json } from '../../integrations/supabase/types';
import { isValidAnswersArray, isValidDimensionScores, isValidDemographics } from './types';

// Assessment Management with Supabase
export const saveAssessmentToSupabase = async (assessment: HEARTIAssessment): Promise<boolean> => {
  try {
    // Generate a custom email for anonymous users
    const email = `anonymous@${assessment.userId.substring(0, 8)}.com`;
    
    // Since we can't guarantee the profile exists in Supabase due to FK constraints,
    // we'll bypass the user profile check and try to save directly
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id: assessment.userId,
        organization_id: assessment.organizationId || null,
        date: assessment.date,
        answers: assessment.answers as unknown as Json,
        dimension_scores: assessment.dimensionScores as unknown as Json,
        overall_score: assessment.overallScore,
        demographics: assessment.demographics as unknown as Json || null,
        // Add email information directly in the assessment for Google Sheets export
        email: email
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving assessment to Supabase:', error);
      return false;
    }
    
    console.log('Assessment saved successfully to Supabase with ID:', data?.id);
    
    // Now directly call the sync-assessment-to-sheet function to ensure the data gets to Google Sheets
    try {
      console.log('Directly calling sync-assessment-to-sheet function...');
      const { data: functionData, error: functionError } = await supabase.functions.invoke('sync-assessment-to-sheet', {
        body: {
          assessment_id: data?.id,
          user_id: assessment.userId,
          date: assessment.date,
          overall_score: assessment.overallScore,
          dimension_scores: assessment.dimensionScores,
          demographics: assessment.demographics,
          email: email,
          answers: assessment.answers
        }
      });
      
      if (functionError) {
        console.error('Error calling sync function:', functionError);
      } else {
        console.log('Edge function response:', functionData);
      }
    } catch (functionCallError) {
      console.error('Failed to call sync-assessment-to-sheet function:', functionCallError);
      // Continue anyway since the database insert was successful
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save assessment to Supabase:', error);
    return false;
  }
};

export const getAssessmentsFromSupabase = async (): Promise<HEARTIAssessment[]> => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*');

    if (error) {
      console.error('Error fetching assessments from Supabase:', error);
      return [];
    }
    
    // Transform the data structure from Supabase format to application format
    return data.map(item => {
      const answers = isValidAnswersArray(item.answers) 
        ? item.answers 
        : [] as HEARTIAnswer[];
      
      const dimensionScores = isValidDimensionScores(item.dimension_scores)
        ? item.dimension_scores as Record<HEARTIDimension, number>
        : {} as Record<HEARTIDimension, number>;
        
      const demographics = isValidDemographics(item.demographics)
        ? item.demographics as Demographics
        : undefined;
        
      return {
        id: item.id,
        userId: item.user_id,
        organizationId: item.organization_id || undefined,
        date: item.date,
        answers: answers,
        dimensionScores: dimensionScores,
        overallScore: item.overall_score,
        demographics: demographics
      };
    });
  } catch (error) {
    console.error('Failed to get assessments from Supabase:', error);
    return [];
  }
};

export const getUserAssessmentsFromSupabase = async (userId: string): Promise<HEARTIAssessment[]> => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user assessments from Supabase:', error);
      return [];
    }
    
    // Transform the data structure from Supabase format to application format
    return data.map(item => {
      const answers = isValidAnswersArray(item.answers) 
        ? item.answers 
        : [] as HEARTIAnswer[];
      
      const dimensionScores = isValidDimensionScores(item.dimension_scores)
        ? item.dimension_scores as Record<HEARTIDimension, number>
        : {} as Record<HEARTIDimension, number>;
      
      const demographics = isValidDemographics(item.demographics)
        ? item.demographics as Demographics
        : undefined;
        
      return {
        id: item.id,
        userId: item.user_id,
        organizationId: item.organization_id || undefined,
        date: item.date,
        answers: answers,
        dimensionScores: dimensionScores,
        overallScore: item.overall_score,
        demographics: demographics
      };
    });
  } catch (error) {
    console.error('Failed to get user assessments from Supabase:', error);
    return [];
  }
};

export const getOrganizationAssessmentsFromSupabase = async (organizationId: string): Promise<HEARTIAssessment[]> => {
  try {
    // Using the dedicated function to get organization assessments with proper RLS
    const { data, error } = await supabase.rpc(
      'get_organization_assessments', 
      { org_id: organizationId }
    );

    if (error) {
      console.error('Error fetching organization assessments from Supabase:', error);
      return [];
    }
    
    // Transform the data structure from Supabase format to application format
    return data.map(item => {
      const answers = isValidAnswersArray(item.answers) 
        ? item.answers 
        : [] as HEARTIAnswer[];
      
      const dimensionScores = isValidDimensionScores(item.dimension_scores)
        ? item.dimension_scores as Record<HEARTIDimension, number>
        : {} as Record<HEARTIDimension, number>;
      
      const demographics = isValidDemographics(item.demographics)
        ? item.demographics as Demographics
        : undefined;
        
      return {
        id: item.id,
        userId: item.user_id,
        organizationId: item.organization_id || undefined,
        date: item.date,
        answers: answers,
        dimensionScores: dimensionScores,
        overallScore: item.overall_score,
        demographics: demographics
      };
    });
  } catch (error) {
    console.error('Failed to get organization assessments from Supabase:', error);
    return [];
  }
};

export const deleteAssessmentFromSupabase = async (assessmentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', assessmentId);

    if (error) {
      console.error('Error deleting assessment from Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete assessment from Supabase:', error);
    return false;
  }
};

export const getAssessmentByIdFromSupabase = async (assessmentId: string): Promise<HEARTIAssessment | null> => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching assessment from Supabase:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Transform the data structure from Supabase format to application format
    const answers = isValidAnswersArray(data.answers) 
      ? data.answers 
      : [] as HEARTIAnswer[];
    
    const dimensionScores = isValidDimensionScores(data.dimension_scores)
      ? data.dimension_scores as Record<HEARTIDimension, number>
      : {} as Record<HEARTIDimension, number>;
    
    const demographics = isValidDemographics(data.demographics)
      ? data.demographics as Demographics
      : undefined;
      
    return {
      id: data.id,
      userId: data.user_id,
      organizationId: data.organization_id || undefined,
      date: data.date,
      answers: answers,
      dimensionScores: dimensionScores,
      overallScore: data.overall_score,
      demographics: demographics
    };
  } catch (error) {
    console.error('Failed to get assessment from Supabase:', error);
    return null;
  }
};
