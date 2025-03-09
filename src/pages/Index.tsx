
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
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'take' | 'results')}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="take">Take Assessment</TabsTrigger>
          <TabsTrigger value="results" disabled={!latestAssessment}>Your Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="take" className="mt-0">
          <AssessmentTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userAssessments={userAssessments}
            latestAssessment={latestAssessment}
            onComplete={handleAssessmentComplete}
            testingSheets={testingSheets}
            sendLatestToSheets={sendLatestToSheets}
          />
        </TabsContent>
        
        <TabsContent value="results" className="mt-0">
          {latestAssessment && (
            <ResultsTabContent 
              assessment={latestAssessment}
              reportRef={null}
              onExportPDF={() => {}}
              exportingPdf={false}
              topDevelopmentArea="humility"
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Google Sheets integration tools */}
      <GoogleIntegrationTools 
        testingGoogleSheets={testingSheets}
        hasLatestAssessment={!!latestAssessment}
        isCloudEnabled={isSupabaseEnabled}
        onToggleCloud={handleToggleSupabase}
        onSyncToSheets={() => latestAssessment && sendLatestToSheets(latestAssessment)}
        onSignIn={handleGoogleSignIn}
        onConfigureWorkloadIdentity={handleConfigureWorkloadIdentity}
        onTestConnection={testGoogleSheets}
        connectionStatus={
          googleConnection.connected 
            ? { status: 'connected', email: googleConnection.email } 
            : { status: 'disconnected' }
        }
      />
    </div>
  );
};

export default Index;
