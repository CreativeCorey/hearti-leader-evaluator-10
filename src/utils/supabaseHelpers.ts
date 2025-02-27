
import { supabase } from "@/integrations/supabase/client";
import { HEARTIAssessment, UserProfile, Organization } from "../types";
import { Json } from "@/integrations/supabase/types";

// Authentication utilities
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    throw error;
  }
  return data.user;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error getting session:", error);
    throw error;
  }
  return data.session;
};

// Profile utilities
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    createdAt: data.created_at,
    name: data.name,
    email: data.email,
    organizationId: data.organization_id,
    role: data.role,
  };
};

export const createUserProfile = async (profile: {
  id: string;
  email: string;
  name?: string | null;
  organizationId?: string | null;
}): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: profile.id,
      email: profile.email,
      name: profile.name || null,
      organization_id: profile.organizationId || null,
    })
    .select()
    .maybeSingle();
  
  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    createdAt: data.created_at,
    name: data.name,
    email: data.email,
    organizationId: data.organization_id,
    role: data.role,
  };
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<{
    name: string | null;
    email: string;
    organizationId: string | null;
  }>
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      email: updates.email,
      organization_id: updates.organizationId,
    })
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    createdAt: data.created_at,
    name: data.name,
    email: data.email,
    organizationId: data.organization_id,
    role: data.role,
  };
};

// Organization utilities
export const getOrganizations = async (): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*');
  
  if (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
  
  return data.map(org => ({
    id: org.id,
    createdAt: org.created_at,
    name: org.name,
    description: org.description || undefined
  }));
};

export const getOrganizationById = async (id: string): Promise<Organization | null> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    createdAt: data.created_at,
    name: data.name,
    description: data.description || undefined
  };
};

export const createOrganization = async (
  name: string,
  description?: string
): Promise<Organization | null> => {
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      name,
      description: description || null
    })
    .select()
    .maybeSingle();
  
  if (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    createdAt: data.created_at,
    name: data.name,
    description: data.description || undefined
  };
};

export const updateOrganization = async (
  id: string,
  updates: Partial<{ name: string; description: string | null }>
): Promise<Organization | null> => {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();
  
  if (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    createdAt: data.created_at,
    name: data.name,
    description: data.description || undefined
  };
};

// Assessment utilities
export const getAssessments = async (): Promise<HEARTIAssessment[]> => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*');
  
  if (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
  
  return data.map(assessment => ({
    id: assessment.id,
    userId: assessment.user_id,
    organizationId: assessment.organization_id || undefined,
    date: assessment.date,
    answers: assessment.answers as any,
    dimensionScores: assessment.dimension_scores as any,
    overallScore: assessment.overall_score,
    demographics: assessment.demographics as any || undefined
  }));
};

export const getUserAssessments = async (userId: string): Promise<HEARTIAssessment[]> => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error fetching user assessments:", error);
    throw error;
  }
  
  return data.map(assessment => ({
    id: assessment.id,
    userId: assessment.user_id,
    organizationId: assessment.organization_id || undefined,
    date: assessment.date,
    answers: assessment.answers as any,
    dimensionScores: assessment.dimension_scores as any,
    overallScore: assessment.overall_score,
    demographics: assessment.demographics as any || undefined
  }));
};

export const getOrganizationAssessments = async (organizationId: string): Promise<HEARTIAssessment[]> => {
  const { data, error } = await supabase
    .rpc('get_organization_assessments', { org_id: organizationId });
  
  if (error) {
    console.error("Error fetching organization assessments:", error);
    throw error;
  }
  
  return data.map(assessment => ({
    id: assessment.id,
    userId: assessment.user_id,
    organizationId: assessment.organization_id || undefined,
    date: assessment.date,
    answers: assessment.answers as any,
    dimensionScores: assessment.dimension_scores as any,
    overallScore: assessment.overall_score,
    demographics: assessment.demographics as any || undefined
  }));
};

export const saveAssessment = async (assessment: Omit<HEARTIAssessment, 'id'>): Promise<HEARTIAssessment | null> => {
  // Convert from our application model to the database schema
  const dbAssessment = {
    user_id: assessment.userId,
    organization_id: assessment.organizationId || null,
    date: assessment.date,
    answers: assessment.answers as Json,
    dimension_scores: assessment.dimensionScores as Json,
    overall_score: assessment.overallScore,
    demographics: assessment.demographics as Json || null
  };
  
  const { data, error } = await supabase
    .from('assessments')
    .insert(dbAssessment)
    .select()
    .maybeSingle();
  
  if (error) {
    console.error("Error saving assessment:", error);
    throw error;
  }
  
  if (!data) return null;
  
  return {
    id: data.id,
    userId: data.user_id,
    organizationId: data.organization_id || undefined,
    date: data.date,
    answers: data.answers as any,
    dimensionScores: data.dimension_scores as any,
    overallScore: data.overall_score,
    demographics: data.demographics as any || undefined
  };
};

export const deleteAssessment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting assessment:", error);
    throw error;
  }
};
