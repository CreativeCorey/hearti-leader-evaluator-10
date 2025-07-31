import { supabase } from '../../integrations/supabase/client';
import { HEARTIAssessment } from '../../types';
import { saveAssessment } from '../supabase/assessments';
import { getLocalAssessments } from './assessments';
import { ASSESSMENTS_KEY } from './constants';

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
}

export const migrateLocalStorageToSupabase = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: false,
    migratedCount: 0,
    errors: []
  };

  try {
    console.log('Starting localStorage to Supabase migration...');
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      result.errors.push('No authenticated user found. Please sign in first.');
      return result;
    }

    const authenticatedUserId = session.user.id;
    const userEmail = session.user.email;
    
    console.log('Authenticated user:', authenticatedUserId, userEmail);

    // Get all assessments from localStorage
    const localAssessments = await getLocalAssessments();
    
    if (localAssessments.length === 0) {
      result.success = true;
      console.log('No assessments found in localStorage to migrate.');
      return result;
    }

    console.log(`Found ${localAssessments.length} assessments in localStorage`);

    // Check if user already has assessments in Supabase
    const { data: existingAssessments, error: fetchError } = await supabase
      .from('assessments')
      .select('id')
      .eq('user_id', authenticatedUserId);

    if (fetchError) {
      result.errors.push(`Error checking existing assessments: ${fetchError.message}`);
      return result;
    }

    const existingIds = new Set(existingAssessments?.map(a => a.id) || []);

    // Filter assessments to migrate (skip ones already in Supabase)
    const assessmentsToMigrate = localAssessments.filter(assessment => 
      !existingIds.has(assessment.id)
    );

    if (assessmentsToMigrate.length === 0) {
      result.success = true;
      console.log('All assessments already exist in Supabase.');
      return result;
    }

    console.log(`Migrating ${assessmentsToMigrate.length} new assessments...`);

    // Migrate each assessment
    for (const assessment of assessmentsToMigrate) {
      try {
        // Update the assessment to use the authenticated user's ID
        const updatedAssessment: HEARTIAssessment = {
          ...assessment,
          userId: authenticatedUserId
        };

        // Save to Supabase
        await saveAssessment(updatedAssessment);
        result.migratedCount++;
        
        console.log(`Migrated assessment ${assessment.id}`);
      } catch (error) {
        const errorMessage = `Failed to migrate assessment ${assessment.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMessage);
        result.errors.push(errorMessage);
      }
    }

    // If all migrations were successful, update localStorage to remove duplicates
    if (result.errors.length === 0) {
      try {
        // Keep only assessments that weren't migrated (shouldn't be any, but just in case)
        const remainingAssessments = localAssessments.filter(assessment => 
          existingIds.has(assessment.id)
        );
        
        // Update localStorage with the remaining assessments
        localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(remainingAssessments));
        
        console.log('Updated localStorage after successful migration');
      } catch (error) {
        console.error('Error updating localStorage after migration:', error);
        result.errors.push('Migration successful but failed to clean up localStorage');
      }
    }

    result.success = result.errors.length === 0;
    
    console.log(`Migration completed. Migrated: ${result.migratedCount}, Errors: ${result.errors.length}`);
    
    return result;
  } catch (error) {
    const errorMessage = `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(errorMessage);
    result.errors.push(errorMessage);
    return result;
  }
};

// Helper function to run migration and show results
export const runMigrationWithLog = async (): Promise<void> => {
  const result = await migrateLocalStorageToSupabase();
  
  if (result.success) {
    console.log(`✅ Migration successful! Migrated ${result.migratedCount} assessments.`);
  } else {
    console.error('❌ Migration failed with errors:');
    result.errors.forEach(error => console.error(`  - ${error}`));
  }
};
