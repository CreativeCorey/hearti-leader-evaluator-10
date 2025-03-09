
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResultsTabContent from '@/components/results/ResultsTabContent';
import AssessmentTabs from '@/components/assessment/AssessmentTabs';
import { useIndexPage } from '@/hooks/useIndexPage';
import LoadingState from '@/components/index/LoadingState';
import GoogleIntegrationTools from '@/components/google-integration/GoogleIntegrationTools';
import HeaderSection from '@/components/assessment/HeaderSection';
import { HEARTIAssessment } from '@/types';

const Index = () => {
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

  // Send the latest assessment to Google Sheets when needed
  const handleSendToSheets = () => {
    if (latestAssessment) {
      sendLatestToSheets(latestAssessment);
    }
  };

  // If still loading, show loading state
  if (loading) return <LoadingState />;

  // Ready to render content now
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <HeaderSection profile={profile} />
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'take' | 'results')}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="take">Take Assessment</TabsTrigger>
          <TabsTrigger value="results" disabled={!latestAssessment}>Your Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="take" className="mt-0">
          <AssessmentTabs onAssessmentComplete={handleAssessmentComplete} />
        </TabsContent>
        
        <TabsContent value="results" className="mt-0">
          {latestAssessment && (
            <ResultsTabContent 
              assessment={latestAssessment}
              assessments={userAssessments}
              googleConnection={googleConnection}
              isSupabaseEnabled={isSupabaseEnabled}
              testingSheets={testingSheets}
              syncDialogOpen={syncDialogOpen}
              syncStatus={syncStatus}
              onToggleSupabase={handleToggleSupabase}
              onConfirmSync={handleConfirmSync}
              onCancelSync={handleCancelSync}
              onSyncDialogClose={handleSyncDialogClose}
              onGoogleSignIn={handleGoogleSignIn}
              onConfigureWorkloadIdentity={handleConfigureWorkloadIdentity}
              onTestGoogleSheets={testGoogleSheets}
              onSendToSheets={handleSendToSheets}
              configuringWorkloadIdentity={configuringWorkloadIdentity}
              isMobile={isMobile}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Google Sheets integration tools */}
      <GoogleIntegrationTools 
        googleConnection={googleConnection}
        latestAssessment={latestAssessment}
        isSupabaseEnabled={isSupabaseEnabled}
        onToggleSupabase={handleToggleSupabase}
        onSendToSheets={handleSendToSheets}
        onGoogleSignIn={handleGoogleSignIn}
        onConfigureWorkloadIdentity={handleConfigureWorkloadIdentity}
        onTestGoogleSheets={testGoogleSheets}
      />
    </div>
  );
};

export default Index;
