import { supabase } from '../integrations/supabase/client';
import { HEARTIAssessment, UserProfile } from '../types';

interface BulkImportResult {
  success: boolean;
  usersImported: number;
  assessmentsImported: number;
  errors: string[];
}

interface ImportData {
  users?: UserProfile[];
  assessments?: HEARTIAssessment[];
}

// Bulk import users and assessments
export const bulkImportData = async (data: ImportData): Promise<BulkImportResult> => {
  const result: BulkImportResult = {
    success: false,
    usersImported: 0,
    assessmentsImported: 0,
    errors: []
  };

  try {
    console.log('Starting bulk import...');

    // Import users first (profiles)
    if (data.users && data.users.length > 0) {
      console.log(`Importing ${data.users.length} users...`);
      
      for (const user of data.users) {
        try {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              name: user.name || null,
              email: user.email,
              organization_id: user.organizationId || null,
              role: (user.role || 'user') as 'user' | 'admin',
              created_at: user.createdAt || new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (error) {
            result.errors.push(`Failed to import user ${user.email}: ${error.message}`);
          } else {
            result.usersImported++;
          }
        } catch (error) {
          result.errors.push(`Error importing user ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    // Import assessments
    if (data.assessments && data.assessments.length > 0) {
      console.log(`Importing ${data.assessments.length} assessments...`);
      
      for (const assessment of data.assessments) {
        try {
          // Get user email for the assessment
          let email: string | undefined;
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', assessment.userId)
              .maybeSingle();
            
            email = profile?.email;
          } catch (error) {
            console.error('Could not fetch user email for assessment:', error);
          }

          const { error } = await supabase
            .from('assessments')
            .upsert({
              id: assessment.id,
              user_id: assessment.userId,
              organization_id: assessment.organizationId || null,
              date: assessment.date,
              answers: assessment.answers as any,
              dimension_scores: assessment.dimensionScores as any,
              overall_score: assessment.overallScore,
              demographics: assessment.demographics as any,
              email: email || `user@${assessment.userId.substring(0, 8)}.com`
            });

          if (error) {
            result.errors.push(`Failed to import assessment ${assessment.id}: ${error.message}`);
          } else {
            result.assessmentsImported++;
          }
        } catch (error) {
          result.errors.push(`Error importing assessment ${assessment.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    result.success = result.errors.length === 0;
    
    console.log(`Import completed. Users: ${result.usersImported}, Assessments: ${result.assessmentsImported}, Errors: ${result.errors.length}`);
    
    return result;
  } catch (error) {
    const errorMessage = `Bulk import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMessage);
    result.errors.push(errorMessage);
    return result;
  }
};

// Import from JSON data
export const importFromJSON = async (jsonData: string): Promise<BulkImportResult> => {
  try {
    const data = JSON.parse(jsonData) as ImportData;
    return await bulkImportData(data);
  } catch (error) {
    return {
      success: false,
      usersImported: 0,
      assessmentsImported: 0,
      errors: [`Invalid JSON data: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
};

// Helper function to create sample data structure
export const createSampleImportData = (): ImportData => {
  return {
    users: [
      {
        id: 'sample-user-id-1',
        email: 'user1@example.com',
        name: 'Sample User 1',
        role: 'user',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-user-id-2', 
        email: 'admin@example.com',
        name: 'Sample Admin',
        role: 'admin',
        organizationId: 'sample-org-id',
        createdAt: new Date().toISOString()
      }
    ],
    assessments: [
      {
        id: 'sample-assessment-1',
        userId: 'sample-user-id-1',
        date: new Date().toISOString(),
        answers: [], // Add your actual answer structure
        dimensionScores: {
          humility: 85,
          empathy: 90,
          accountability: 78,
          resiliency: 82,
          transparency: 88,
          inclusivity: 91
        },
        overallScore: 85.7,
        demographics: {
          managementLevel: 'middle',
          companySize: '100-500',
          jobRole: 'manager'
        }
      }
    ]
  };
};