
import { useState, useEffect } from 'react';
import { useToast } from "./use-toast";
import { useIsMobile } from './use-mobile';
import { HEARTIAssessment, UserProfile } from '../types';
import { getUserProfile, setUseSupabase, getOrCreateAnonymousId } from '../utils/localStorage';
import { useAssessments } from './useAssessments';
import { useSupabaseSync } from './useSupabaseSync';
import { useGoogleIntegration } from './useGoogleIntegration';

export const useIndexPage = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'take' | 'results'>('take');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use our custom hooks
  const { 
    latestAssessment, 
    userAssessments, 
    loadAssessments, 
    handleAssessmentComplete: onAssessmentComplete 
  } = useAssessments();
  
  const {
    isSupabaseEnabled,
    syncDialogOpen,
    syncStatus,
    handleToggleSupabase,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose,
    sendLatestToSheets
  } = useSupabaseSync(loadAssessments);
  
  const {
    googleConnection,
    testingSheets,
    configuringWorkloadIdentity,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity,
    testGoogleSheets
  } = useGoogleIntegration();

  useEffect(() => {
    const init = async () => {
      try {
        // Enable Supabase by default for Google Sheets integration
        const supabaseEnabled = true;
        setUseSupabase(supabaseEnabled);
        
        // Get or create anonymous ID
        const anonymousId = getOrCreateAnonymousId();
        console.log("Anonymous user ID:", anonymousId);
        
        // Get user profile - this should now work with the profile created above
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        
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
  }, [toast, loadAssessments]);

  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    // Use the handler from useAssessments
    onAssessmentComplete(assessment);
    
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
