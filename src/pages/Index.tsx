
import { useEffect } from 'react';
import ResultsTabContent from '@/components/results/ResultsTabContent';
import AssessmentTabs from '@/components/assessment/AssessmentTabs';
import { useIndexPage } from '@/hooks/useIndexPage';
import LoadingState from '@/components/index/LoadingState';
import GoogleIntegrationTools from '@/components/google-integration/GoogleIntegrationTools';
import HeaderSection from '@/components/assessment/HeaderSection';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
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
    isMobile
  } = useIndexPage();

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
    <div className="w-full mx-auto py-2 sm:py-6">
      <div className="w-full mx-auto">
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
          sendLatestToSheets={sendLatestToSheets}
        />
        
        {/* Google Sheets integration tools */}
        <GoogleIntegrationTools 
          testGoogleSheets={testGoogleSheets}
          testingSheets={testingSheets}
        />
      </div>
    </div>
  );
};

export default Index;
