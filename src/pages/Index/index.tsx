
import { useEffect, useState } from 'react';
import IndexContent from './components/IndexContent';
import LoadingState from '../../components/index/LoadingState';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { HEARTIAssessment } from '../../types';
import { getAssessments } from '../../utils/localStorage/assessments';
import { getSettings } from '../../utils/localStorage/settings';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { useGoogleIntegration } from './hooks/useGoogleIntegration';
import { useAssessments } from './hooks/useAssessments';
import { useMobile } from '../../hooks/use-mobile';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'results' | 'take'>('results');
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();

  // All hooks
  const { 
    isSupabaseEnabled,
    handleToggleSupabase,
    syncDialogOpen,
    syncStatus,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose
  } = useSupabaseSync();

  const {
    googleConnection,
    testingSheets,
    handleGoogleSignIn,
    testGoogleSheets,
    sendLatestToSheets,
    configuringWorkloadIdentity,
    handleConfigureWorkloadIdentity
  } = useGoogleIntegration();

  const {
    userAssessments,
    latestAssessment,
    handleAssessmentComplete
  } = useAssessments();

  useEffect(() => {
    const init = async () => {
      try {
        // Load user data
        const settings = getSettings();
        const assessments = getAssessments();
        
        // Check URL for tab parameter
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get('tab');
        if (tabParam === 'take' || tabParam === 'results') {
          setActiveTab(tabParam);
        } else if (assessments.length === 0) {
          // If no assessments, default to take tab
          setActiveTab('take');
        }

      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [location]);

  // Get user profile information
  const profile = user ? {
    id: user.id,
    name: user.user_metadata?.name || "User",
    email: user.email || "",
    avatar: user.user_metadata?.avatar_url || null
  } : null;

  // If still loading, show loading state
  if (loading) return <LoadingState />;

  // Ready to render content now
  return (
    <IndexContent
      loading={loading}
      profile={profile}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userAssessments={userAssessments}
      latestAssessment={latestAssessment}
      googleConnection={googleConnection}
      isSupabaseEnabled={isSupabaseEnabled}
      testingSheets={testingSheets}
      syncDialogOpen={syncDialogOpen}
      syncStatus={syncStatus}
      handleToggleSupabase={handleToggleSupabase}
      handleAssessmentComplete={handleAssessmentComplete}
      handleConfirmSync={handleConfirmSync}
      handleCancelSync={handleCancelSync}
      handleSyncDialogClose={handleSyncDialogClose}
      handleGoogleSignIn={handleGoogleSignIn}
      handleConfigureWorkloadIdentity={handleConfigureWorkloadIdentity}
      testGoogleSheets={testGoogleSheets}
      sendLatestToSheets={sendLatestToSheets}
      configuringWorkloadIdentity={configuringWorkloadIdentity}
      isMobile={isMobile}
    />
  );
};

export default Index;
