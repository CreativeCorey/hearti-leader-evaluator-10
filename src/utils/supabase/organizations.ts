
import { supabase } from '../../integrations/supabase/client';
import { Organization } from '../../types';

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
