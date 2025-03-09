
import { useState, useEffect } from 'react';
import { useToast } from "./use-toast";
import { useIsMobile } from './use-mobile';
import { HEARTIAssessment, UserProfile } from '../types';
import { 
  getCurrentUser, 
  getCurrentUserAssessments, 
  setUseSupabase, 
  getOrCreateAnonymousId,
  syncLocalDataToSupabase
} from '../utils/localStorage';
import { supabase } from '../integrations/supabase/client';
import { 
  signInWithGoogle, 
  testGoogleSheetsConnection, 
  setupWorkloadIdentity, 
  getGoogleConnection 
} from '../utils/googleAuth';

export const useIndexPage = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'take' | 'results'>('take');
  const [latestAssessment, setLatestAssessment] = useState<HEARTIAssessment | null>(null);
  const [userAssessments, setUserAssessments] = useState<HEARTIAssessment[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [testingSheets, setTestingSheets] = useState(false);
  const [googleConnection, setGoogleConnection] = useState<{connected: boolean, email?: string}>({ connected: false });
  const [configuringWorkloadIdentity, setConfiguringWorkloadIdentity] = useState(false);
  
  const loadAssessments = async () => {
    try {
      // Fetch user assessments
      const assessments = await getCurrentUserAssessments();
      
      if (assessments.length > 0) {
        // Sort by date (newest first)
        const sortedAssessments = [...assessments].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setUserAssessments(sortedAssessments);
        setLatestAssessment(sortedAssessments[0]);
      } else {
        setUserAssessments([]);
        setLatestAssessment(null);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load assessment data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Enable Supabase by default for Google Sheets integration
        const supabaseEnabled = true;
        setUseSupabase(supabaseEnabled);
        setIsSupabaseEnabled(supabaseEnabled);
        
        // Get or create anonymous ID
        const anonymousId = getOrCreateAnonymousId();
        console.log("Anonymous user ID:", anonymousId);
        
        // Get user profile - this should now work with the profile created above
        const userProfile = await getCurrentUser();
        setProfile(userProfile);
        
        // Check Google connection
        const connection = await getGoogleConnection();
        setGoogleConnection(connection);
        
        // Get assessment data
        await loadAssessments();
      } catch (error) {
        console.error('Error initializing:', error);
        toast({
          title: "Initialization Error",
          description: "There was a problem loading your data. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [toast]);

  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    // Update the latest assessment and user assessments list
    setLatestAssessment(assessment);
    setUserAssessments(prev => [assessment, ...prev]);
    
    // Switch to results tab
    setActiveTab('results');
    
    // Show success message with more specific information
    if (isSupabaseEnabled) {
      toast({
        title: "Assessment Complete!",
        description: "Your assessment has been saved and sent to Google Sheets. It may take a few moments to appear in the sheet.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Assessment Complete!",
        description: "Your assessment has been saved locally. To send to Google Sheets, enable Cloud Storage.",
        duration: 5000,
      });
    }
  };
  
  const handleToggleSupabase = async (enabled: boolean) => {
    if (enabled) {
      // If enabling Supabase, offer to sync local data
      setSyncDialogOpen(true);
    } else {
      // If disabling Supabase, just update the setting
      setUseSupabase(false);
      setIsSupabaseEnabled(false);
      
      toast({
        title: "Local storage enabled",
        description: "Your data will now be stored locally in this browser. Google Sheets integration is disabled.",
      });
    }
  };
  
  const handleConfirmSync = async () => {
    setSyncStatus('syncing');
    
    try {
      // Get or create anonymous ID and ensure profile exists first
      getOrCreateAnonymousId();
      
      // Then sync data from localStorage to Supabase
      const success = await syncLocalDataToSupabase();
      
      if (success) {
        // Update UI state
        setUseSupabase(true);
        setIsSupabaseEnabled(true);
        setSyncStatus('success');
        
        // Reload assessments to get from Supabase
        await loadAssessments();
        
        toast({
          title: "Cloud storage enabled",
          description: "Your data has been synced to cloud storage, and Google Sheets integration is now active.",
        });
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      
      toast({
        title: "Sync Failed",
        description: "Could not sync your data to cloud storage. Google Sheets integration may not work properly.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancelSync = () => {
    setSyncDialogOpen(false);
  };
  
  const handleSyncDialogClose = () => {
    setSyncDialogOpen(false);
    setSyncStatus('idle');
  };
  
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
  
  const handleConfigureWorkloadIdentity = async () => {
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
      // First test Google Sheets connection
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
  
  const sendLatestToSheets = async () => {
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
    loading,
    profile,
    activeTab,
    setActiveTab,
    userAssessments,
    latestAssessment,
    googleConnection,
    isSupabaseEnabled,
    testingSheets,
    syncDialogOpen,
    syncStatus,
    handleToggleSupabase,
    handleAssessmentComplete,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity,
    testGoogleSheets,
    sendLatestToSheets,
    configuringWorkloadIdentity,
    isMobile
  };
};
