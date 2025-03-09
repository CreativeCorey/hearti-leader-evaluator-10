
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, testGoogleSheetsConnection, setupWorkloadIdentity } from '@/utils/googleAuth';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

export const useGoogleIntegration = () => {
  const { toast } = useToast();
  const [testingSheets, setTestingSheets] = useState(false);
  const [configuringWorkloadIdentity, setConfiguringWorkloadIdentity] = useState(false);
  
  const handleGoogleSignIn = async () => {
    try {
      toast({
        title: "Initiating Google Sign In",
        description: "Redirecting to Google Authentication...",
      });
      
      const success = await signInWithGoogle();
      
      if (!success) {
        toast({
          title: "Google Sign In Failed",
          description: "Could not initiate Google sign in. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
      toast({
        title: "Sign In Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  const handleConfigureWorkloadIdentity = async (googleConnection: {connected: boolean, email?: string}) => {
    if (!googleConnection.connected) {
      toast({
        title: "Not Connected to Google",
        description: "You need to sign in with Google first.",
        variant: "destructive",
      });
      return;
    }
    
    setConfiguringWorkloadIdentity(true);
    
    try {
      const result = await setupWorkloadIdentity();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
      } else {
        toast({
          title: "Configuration Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error configuring workload identity:', error);
      toast({
        title: "Configuration Error",
        description: "An unexpected error occurred while configuring workload identity.",
        variant: "destructive",
      });
    } finally {
      setConfiguringWorkloadIdentity(false);
    }
  };
  
  const testGoogleSheets = async () => {
    setTestingSheets(true);
    try {
      // Test the Google Sheets connection
      const result = await testGoogleSheetsConnection();
      
      if (result.success) {
        toast({
          title: "Google Sheets Connection Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Google Sheets Test Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during Google Sheets test:', error);
      toast({
        title: "Test Error",
        description: "An unexpected error occurred during the test.",
        variant: "destructive",
      });
    } finally {
      setTestingSheets(false);
    }
  };
  
  const sendLatestToSheets = async (latestAssessment: HEARTIAssessment | null) => {
    if (!latestAssessment) {
      toast({
        title: "No Assessment Available",
        description: "Please complete an assessment first.",
        variant: "destructive",
      });
      return;
    }
    
    setTestingSheets(true);
    try {
      // Directly call the sync function with the latest assessment
      const { data, error } = await supabase.functions.invoke('sync-assessment-to-sheet', {
        body: {
          user_id: latestAssessment.userId,
          date: latestAssessment.date,
          overall_score: latestAssessment.overallScore,
          dimension_scores: latestAssessment.dimensionScores,
          demographics: latestAssessment.demographics,
          manual_sync: true
        }
      });
      
      if (error) {
        console.error('Error syncing to Google Sheets:', error);
        toast({
          title: "Sync Failed",
          description: "Could not send your assessment to Google Sheets.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Google Sheets sync response:', data);
      
      toast({
        title: "Assessment Sent",
        description: "Your assessment has been manually sent to Google Sheets.",
      });
    } catch (error) {
      console.error('Error during manual sync:', error);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during the sync attempt.",
        variant: "destructive",
      });
    } finally {
      setTestingSheets(false);
    }
  };
  
  return {
    testingSheets,
    configuringWorkloadIdentity,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity,
    testGoogleSheets,
    sendLatestToSheets
  };
};
