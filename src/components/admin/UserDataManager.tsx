import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeleteResult {
  success: boolean;
  deletedProfiles: number;
  deletedAssessments: number;
  errors: string[];
}

const UserDataManager: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteResult, setDeleteResult] = useState<DeleteResult | null>(null);
  const { toast } = useToast();

  const handleDeleteUserData = async () => {
    if (!userEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setDeleteResult(null);

    try {
      // First, get the user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail.trim())
        .maybeSingle();

      // Also check historical profiles
      const { data: historicalProfile, error: historicalError } = await supabase
        .from('historical_profiles')
        .select('id')
        .eq('email', userEmail.trim())
        .maybeSingle();

      let deletedAssessments = 0;
      let deletedProfiles = 0;
      const errors: string[] = [];

      // Delete assessments for regular user
      if (profile) {
        const { count: assessmentCount, error: deleteAssessmentsError } = await supabase
          .from('assessments')
          .delete({ count: 'exact' })
          .eq('user_id', profile.id);

        if (deleteAssessmentsError) {
          errors.push(`Failed to delete regular assessments: ${deleteAssessmentsError.message}`);
        } else {
          deletedAssessments += assessmentCount || 0;
        }

        // Delete saved activities
        const { error: deleteActivitiesError } = await supabase
          .from('saved_activities')
          .delete()
          .eq('user_id', profile.id);

        if (deleteActivitiesError) {
          errors.push(`Failed to delete saved activities: ${deleteActivitiesError.message}`);
        }

        // Delete habits
        const { error: deleteHabitsError } = await supabase
          .from('habits')
          .delete()
          .eq('user_id', profile.id);

        if (deleteHabitsError) {
          errors.push(`Failed to delete habits: ${deleteHabitsError.message}`);
        }

        // Delete profile
        const { error: deleteProfileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', profile.id);

        if (deleteProfileError) {
          errors.push(`Failed to delete profile: ${deleteProfileError.message}`);
        } else {
          deletedProfiles++;
        }
      }

      // Delete assessments for historical user
      if (historicalProfile) {
        const { count: historicalAssessmentCount, error: deleteHistoricalAssessmentsError } = await supabase
          .from('assessments')
          .delete({ count: 'exact' })
          .eq('historical_profile_id', historicalProfile.id);

        if (deleteHistoricalAssessmentsError) {
          errors.push(`Failed to delete historical assessments: ${deleteHistoricalAssessmentsError.message}`);
        } else {
          deletedAssessments += historicalAssessmentCount || 0;
        }

        // Delete historical profile
        const { error: deleteHistoricalProfileError } = await supabase
          .from('historical_profiles')
          .delete()
          .eq('id', historicalProfile.id);

        if (deleteHistoricalProfileError) {
          errors.push(`Failed to delete historical profile: ${deleteHistoricalProfileError.message}`);
        } else {
          deletedProfiles++;
        }
      }

      if (!profile && !historicalProfile) {
        errors.push('No user found with that email address');
      }

      setDeleteResult({
        success: errors.length === 0,
        deletedProfiles,
        deletedAssessments,
        errors
      });

      if (errors.length === 0) {
        toast({
          title: "Success",
          description: `Deleted ${deletedAssessments} assessments and ${deletedProfiles} profiles for ${userEmail}`,
        });
        setUserEmail('');
      } else {
        toast({
          title: "Partial Success",
          description: `Some errors occurred during deletion. Check the results below.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Delete error:', error);
      setDeleteResult({
        success: false,
        deletedProfiles: 0,
        deletedAssessments: 0,
        errors: [`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
      toast({
        title: "Error",
        description: "An unexpected error occurred during deletion",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    setDeleteResult(null);

    try {
      // Delete all historical assessments
      const { count: historicalAssessmentCount, error: deleteHistoricalAssessmentsError } = await supabase
        .from('assessments')
        .delete({ count: 'exact' })
        .not('historical_profile_id', 'is', null);

      // Delete all historical profiles (only those marked as historical)
      const { count: historicalProfileCount, error: deleteHistoricalProfilesError } = await supabase
        .from('historical_profiles')
        .delete({ count: 'exact' })
        .eq('is_historical', true);

      const errors: string[] = [];
      
      if (deleteHistoricalAssessmentsError) {
        errors.push(`Failed to delete historical assessments: ${deleteHistoricalAssessmentsError.message}`);
      }
      
      if (deleteHistoricalProfilesError) {
        errors.push(`Failed to delete historical profiles: ${deleteHistoricalProfilesError.message}`);
      }

      setDeleteResult({
        success: errors.length === 0,
        deletedProfiles: historicalProfileCount || 0,
        deletedAssessments: historicalAssessmentCount || 0,
        errors
      });

      if (errors.length === 0) {
        toast({
          title: "Success",
          description: `Deleted ${historicalAssessmentCount || 0} historical assessments and ${historicalProfileCount || 0} historical profiles`,
        });
      } else {
        toast({
          title: "Error",
          description: "Some errors occurred during bulk deletion",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Bulk delete error:', error);
      setDeleteResult({
        success: false,
        deletedProfiles: 0,
        deletedAssessments: 0,
        errors: [`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
      toast({
        title: "Error",
        description: "An unexpected error occurred during bulk deletion",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            User Data Management
          </CardTitle>
          <CardDescription>
            Delete user data including assessments, habits, and activities. Use with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Individual User Delete */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delete Individual User Data</h3>
            <div className="space-y-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input
                id="userEmail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter user email address"
                type="email"
              />
            </div>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={!userEmail.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Deleting...' : 'Delete User Data'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Confirm User Data Deletion
                  </AlertDialogTitle>
                   <AlertDialogDescription>
                     <div>
                       This will permanently delete ALL data for user "{userEmail}" including:
                       <ul className="list-disc list-inside mt-2 space-y-1">
                         <li>All assessment results</li>
                         <li>All saved activities</li>
                         <li>All habits and tracking data</li>
                         <li>User profile information</li>
                       </ul>
                       <strong className="text-destructive">This action cannot be undone.</strong>
                     </div>
                   </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUserData} className="bg-destructive text-destructive-foreground">
                    Delete All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator />

          {/* Bulk Delete */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Delete All Historical Data</h3>
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                This will delete ALL historical profiles and assessments imported from Google Sheets. 
                Regular user accounts will not be affected.
              </AlertDescription>
            </Alert>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Deleting...' : 'Delete All Historical Data'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Confirm Bulk Deletion
                  </AlertDialogTitle>
                   <AlertDialogDescription>
                     <div>
                       This will permanently delete ALL historical data including:
                       <ul className="list-disc list-inside mt-2 space-y-1">
                         <li>All historical profiles</li>
                         <li>All historical assessment results</li>
                         <li>All imported Google Sheets data</li>
                       </ul>
                       <strong className="text-destructive">This action cannot be undone.</strong>
                     </div>
                   </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground">
                    Delete All Historical Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Results Display */}
          {deleteResult && (
            <Card className={deleteResult.success ? "border-green-200" : "border-red-200"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {deleteResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                  Deletion Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Deleted Profiles:</strong> {deleteResult.deletedProfiles}</p>
                  <p><strong>Deleted Assessments:</strong> {deleteResult.deletedAssessments}</p>
                  {deleteResult.errors.length > 0 && (
                    <div>
                      <strong className="text-red-600">Errors:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {deleteResult.errors.map((error, index) => (
                          <li key={index} className="text-red-600">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDataManager;