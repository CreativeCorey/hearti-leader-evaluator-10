
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [initialized, setInitialized] = useState(false);
  const [viewTransitioning, setViewTransitioning] = useState(false);
  const previousMobileState = useRef(isMobile);
  
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
  
  const {
    googleConnection,
    testingSheets,
    configuringWorkloadIdentity,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity,
    testGoogleSheets
  } = useGoogleIntegration();

  // Handle mobile view transitions to prevent freezing
  useEffect(() => {
    // Detect changes in mobile state
    if (previousMobileState.current !== isMobile) {
      setViewTransitioning(true);
      
      // Use a short timeout to allow the UI to update smoothly
      const transitionTimer = setTimeout(() => {
        setViewTransitioning(false);
      }, 150);
      
      // Update the reference to the current mobile state
      previousMobileState.current = isMobile;
      
      return () => clearTimeout(transitionTimer);
    }
  }, [isMobile]);

  // Handle orientation change explicitly
  useEffect(() => {
    const handleOrientationChange = () => {
      // Set transitioning state to true during orientation change
      setViewTransitioning(true);
      
      // Use a slightly longer timeout for orientation changes
      // as they take more time than regular resize events
      setTimeout(() => {
        setViewTransitioning(false);
      }, 300);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Memoize initialization function
  const initializeApp = useCallback(async () => {
    if (initialized) return; // Prevent multiple initializations
    
    try {
      // Enable Supabase by default for Google Sheets integration
      const supabaseEnabled = true;
      setUseSupabase(supabaseEnabled);
      
      // Get or create anonymous ID
      const anonymousId = getOrCreateAnonymousId();
      console.log("Anonymous user ID:", anonymousId);
      
      // Get user profile
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      
      // Load assessment data
      await loadAssessments();
      
      setInitialized(true);
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
  }, [toast, loadAssessments, initialized]);

  // Initialize app once on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Auto-switch to results tab if user has assessments
  useEffect(() => {
    if (userAssessments.length > 0 && activeTab === 'take') {
      setActiveTab('results');
      console.log("Auto-switching to results tab due to existing assessment data");
    }
  }, [userAssessments, activeTab]);

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
  }, [isSupabaseEnabled, onAssessmentComplete, toast]);

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
