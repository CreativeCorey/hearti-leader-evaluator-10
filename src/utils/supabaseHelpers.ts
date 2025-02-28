import { supabase } from '../integrations/supabase/client';
import { HEARTIAssessment, UserProfile, Organization, HEARTIAnswer, HEARTIDimension, Demographics } from '../types';
import { Json } from '../integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid';

// Type guard to ensure safe conversion from Json to our application types
function isValidAnswersArray(data: any): data is HEARTIAnswer[] {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 'questionId' in item && 'score' in item
  );
}

function isValidDimensionScores(data: any): data is Record<HEARTIDimension, number> {
  if (typeof data !== 'object' || data === null) return false;
  
  const validDimensions = ['humility', 'empathy', 'accountability', 'resiliency', 'transparency', 'inclusivity'];
  return validDimensions.every(dim => dim in data && typeof data[dim] === 'number');
}

function isValidDemographics(data: any): data is Demographics {
  return typeof data === 'object' && data !== null;
}

// Helper function to ensure a user profile exists in Supabase
export const ensureUserProfileExists = async (userId: string): Promise<boolean> => {
  try {
    // Check if the profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error checking user profile:', fetchError);
      return false;
    }
    
    // If profile exists, return true
    if (existingProfile) return true;
    
    // Otherwise, create a new profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: 'anonymous@example.com', // Placeholder email for anonymous users
        role: 'user'
      });
    
    if (insertError) {
      console.error('Error creating user profile:', insertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to ensure user profile exists:', error);
    return false;
  }
};

// Assessment Management with Supabase
export const saveAssessmentToSupabase = async (assessment: HEARTIAssessment): Promise<boolean> => {
  try {
    // First ensure the user profile exists
    const profileExists = await ensureUserProfileExists(assessment.userId);
    if (!profileExists) {
      console.error('Could not ensure user profile exists before saving assessment');
      return false;
    }
    
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: assessment.userId,
        organization_id: assessment.organizationId || null,
        date: assessment.date,
        answers: assessment.answers as unknown as Json,
        dimension_scores: assessment.dimensionScores as unknown as Json,
        overall_score: assessment.overallScore,
        demographics: assessment.demographics as unknown as Json || null
      });

    if (error) {
      console.error('Error saving assessment to Supabase:', error);
      return false;
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

// User Management with Supabase
export const saveUserProfileToSupabase = async (profile: UserProfile): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        name: profile.name || null,
        email: profile.email || null,
        organization_id: profile.organizationId || null,
        role: profile.role || 'user'
      });

    if (error) {
      console.error('Error saving user profile to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save user profile to Supabase:', error);
    return false;
  }
};

export const getUserProfileFromSupabase = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile from Supabase:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Transform the data structure from Supabase format to application format
    return {
      id: data.id,
      createdAt: data.created_at,
      name: data.name || undefined,
      email: data.email || undefined,
      organizationId: data.organization_id || undefined,
      role: data.role || 'user'
    };
  } catch (error) {
    console.error('Failed to get user profile from Supabase:', error);
    return null;
  }
};

// Organization Management with Supabase
export const saveOrganizationToSupabase = async (organization: Organization): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('organizations')
      .upsert({
        id: organization.id,
        name: organization.name,
        description: organization.description || null
      });

    if (error) {
      console.error('Error saving organization to Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save organization to Supabase:', error);
    return false;
  }
};

export const getOrganizationsFromSupabase = async (): Promise<Organization[]> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*');

    if (error) {
      console.error('Error fetching organizations from Supabase:', error);
      return [];
    }
    
    // Transform the data structure from Supabase format to application format
    return data.map(item => ({
      id: item.id,
      createdAt: item.created_at,
      name: item.name,
      description: item.description || undefined
    }));
  } catch (error) {
    console.error('Failed to get organizations from Supabase:', error);
    return [];
  }
};

export const getOrganizationByIdFromSupabase = async (organizationId: string): Promise<Organization | null> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching organization from Supabase:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Transform the data structure from Supabase format to application format
    return {
      id: data.id,
      createdAt: data.created_at,
      name: data.name,
      description: data.description || undefined
    };
  } catch (error) {
    console.error('Failed to get organization from Supabase:', error);
    return null;
  }
};
