
import { useState, useCallback } from 'react';
import { useToast } from "./use-toast";
import { HEARTIAssessment } from '../types';
import { setUseSupabase } from '../utils/localStorage';
import { useAssessments } from './useAssessments';
import { useSupabaseSync } from './useSupabaseSync';
import { useGoogleIntegration } from './useGoogleIntegration';
import { useViewTransitions } from './useViewTransitions';
import { useAppInitialization } from './useAppInitialization';
import { useTabManagement } from './useTabManagement';

export const useIndexPage = () => {
  const { toast } = useToast();

  // Use our custom hooks with memoized callbacks
  const { 
    latestAssessment, 
    currentAssessment,
    setCurrentAssessment,
    userAssessments, 
    setUserAssessments,
    assessmentStatus,
    loadAssessments, 
    handleAssessmentComplete: onAssessmentComplete 
  } = useAssessments();
  
  // App initialization hook
  const { loading, profile, initialized } = useAppInitialization({ loadAssessments });
  
  // View transitions hook
  const { isMobile, viewTransitioning } = useViewTransitions();
  
  // Tab management hook
  const { activeTab, setActiveTab } = useTabManagement({ 
    userAssessments, 
    loading 
  });
  
  // Supabase sync hook
  const {
    isSupabaseEnabled,
    syncDialogOpen,
    syncStatus,
    syncSettings,
    setSyncSettings,
    triggerSync,
    handleToggleSupabase,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose,
    sendLatestToSheets
  } = useSupabaseSync(loadAssessments);
  
  // Google integration hook
  const {
    googleConnection,
    testingSheets,
    configuringWorkloadIdentity,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity,
    testGoogleSheets
  } = useGoogleIntegration();

  // Show error toast only when assessment status changes to error
  useEffect(() => {
    if (assessmentStatus === 'error') {
      toast({
        title: "Connection Issue",
        description: "We couldn't connect to our servers. Your data will be saved locally for now.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [assessmentStatus, toast]);

  const handleAssessmentComplete = useCallback((assessment: HEARTIAssessment) => {
    // Use the handler from useAssessments
    onAssessmentComplete(assessment);
    
    // Switch to results tab
    setActiveTab('results');
    
    // Show success message
    toast({
      title: "Assessment Complete!",
      description: isSupabaseEnabled
        ? "Your assessment has been saved and sent to Google Sheets."
        : "Your assessment has been saved locally. To send to Google Sheets, enable Cloud Storage.",
      duration: 5000,
    });
  }, [isSupabaseEnabled, onAssessmentComplete, toast, setActiveTab]);

  return {
    loading,
    profile,
    activeTab,
    setActiveTab,
    userAssessments,
    setUserAssessments,
    latestAssessment,
    currentAssessment,
    setCurrentAssessment,
    assessmentStatus,
    googleConnection,
    isSupabaseEnabled,
    testingSheets,
    syncDialogOpen,
    syncStatus,
    syncSettings,
    setSyncSettings,
    triggerSync,
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
    isMobile,
    viewTransitioning
  };
};
