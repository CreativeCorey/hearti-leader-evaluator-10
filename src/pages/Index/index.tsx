
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResultsTabContent from '@/components/results/ResultsTabContent';
import AssessmentTabs from '@/components/assessment/AssessmentTabs';
import { useIndexPage } from '@/hooks/useIndexPage';
import LoadingState from '@/components/index/LoadingState';
import GoogleIntegrationTools from '@/components/google-integration/GoogleIntegrationTools';
import HeaderSection from '@/components/assessment/HeaderSection';
import { HEARTIAssessment } from '@/types';

const Index = () => {
  const navigate = useNavigate();
  const {
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
  } = useIndexPage();

  // Check if user should see intro sequence
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hearti_intro_seen');
    if (!hasSeenIntro) {
      navigate('/intro', { replace: true });
    }
  }, [navigate]);

  // If still loading, show loading state
  if (loading) return <LoadingState />;

  // Ready to render content now
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <HeaderSection 
        profile={profile} 
        isSupabaseEnabled={isSupabaseEnabled}
        handleToggleSupabase={handleToggleSupabase}
        googleConnection={googleConnection}
        isMobile={isMobile}
      />
      
      <AssessmentTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userAssessments={userAssessments}
        latestAssessment={latestAssessment}
        onComplete={handleAssessmentComplete}
        testingSheets={testingSheets}
        sendLatestToSheets={() => latestAssessment && sendLatestToSheets(latestAssessment)}
      />
      
      {/* Google Sheets integration tools */}
      <GoogleIntegrationTools 
        testGoogleSheets={testGoogleSheets}
        testingSheets={testingSheets}
      />
    </div>
  );
};

export default Index;
