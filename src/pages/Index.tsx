
import { useEffect } from 'react';
import { useIndexPage } from '@/hooks/useIndexPage';
import LoadingState from '@/components/index/LoadingState';
import GoogleIntegrationTools from '@/components/google-integration/GoogleIntegrationTools';
import AssessmentTabs from '@/components/assessment/AssessmentTabs';
import HeaderSection from '@/components/assessment/HeaderSection';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const {
    loading,
    profile,
    activeTab,
    setActiveTab,
    userAssessments,
    latestAssessment,
    assessmentStatus,
    googleConnection,
    isSupabaseEnabled,
    testingSheets,
    handleToggleSupabase,
    handleAssessmentComplete,
    testGoogleSheets,
    sendLatestToSheets,
    isMobile,
    viewTransitioning
  } = useIndexPage();

  // If URL has tab parameter, update active tab
  useEffect(() => {
    if (tabParam && (tabParam === 'take' || tabParam === 'results')) {
      setActiveTab(tabParam);
    }
  }, [tabParam, setActiveTab]);

  // If error occurs during load, show error toast
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

  // If still loading, show loading state
  if (loading) return <LoadingState />;

  // Ready to render content now
  return (
    <>
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
        sendLatestToSheets={() => {
          if (latestAssessment) {
            return sendLatestToSheets(latestAssessment);
          }
          return Promise.resolve();
        }}
        viewTransitioning={viewTransitioning}
      />
      
      {/* Google Sheets integration tools */}
      <GoogleIntegrationTools 
        testGoogleSheets={testGoogleSheets}
        testingSheets={testingSheets}
      />
    </>
  );
};

export default Index;
