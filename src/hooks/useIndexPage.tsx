
import { useState, useEffect, useCallback } from 'react';
import { HEARTIAssessment } from '../types';
import { useToast } from './use-toast';
import { getUserProfile, setUseSupabase, getOrCreateAnonymousId } from '../utils/localStorage';
import { useViewTransitions } from './useViewTransitions';
import { useAppInitialization } from './useAppInitialization';
import { useTabManagement } from './useTabManagement';
import { showSuccessToast, showErrorToast } from '@/utils/notifications';

// Import all necessary hooks and services
import { useAssessments } from '../pages/Index/hooks/useAssessments';
import { useGoogleIntegration } from '../pages/Index/hooks/useGoogleIntegration';
import { useSupabaseSync } from '../pages/Index/hooks/useSupabaseSync';

interface UseIndexPageProps {
  loadAssessments?: () => Promise<void>;
  userAssessments?: HEARTIAssessment[];
}

export const useIndexPage = (props?: UseIndexPageProps) => {
  const [loading, setLoading] = useState(true);
  
  // Get assessments
  const {
    assessments: userAssessments,
    latestAssessment,
    loadAssessments,
    status: assessmentStatus,
    handleAssessmentComplete
  } = useAssessments();
  
  // Use the Google integration hook
  const {
    connection: googleConnection,
    testingSheets,
    testGoogleSheets,
    sendLatestToSheets,
    configuringWorkloadIdentity,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity
  } = useGoogleIntegration();
  
  // Use the Supabase sync hook
  const {
    isSupabaseEnabled,
    syncDialogOpen,
    syncStatus,
    handleToggleSupabase,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose
  } = useSupabaseSync();
  
  // Get user profile
  const profile = getUserProfile();
  
  // Use the extracted hooks
  const { isMobile, viewTransitioning } = useViewTransitions();
  const { initialized } = useAppInitialization({ 
    loadAssessments: props?.loadAssessments || loadAssessments 
  });
  const { activeTab, setActiveTab } = useTabManagement({ 
    userAssessments: props?.userAssessments || userAssessments, 
    loading 
  });

  // Sync the loading state based on initialization
  useEffect(() => {
    if (initialized) {
      setLoading(false);
    }
  }, [initialized]);

  return {
    loading,
    activeTab,
    setActiveTab,
    isMobile,
    viewTransitioning,
    
    // Include all the properties needed by the Index pages
    profile,
    userAssessments,
    latestAssessment,
    assessmentStatus,
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
    configuringWorkloadIdentity
  };
};
