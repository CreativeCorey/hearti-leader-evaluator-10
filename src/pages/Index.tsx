
import React from 'react';
import Layout from '../components/Layout';
import { useIndexPage } from '../hooks/useIndexPage';
import IndexContent from '../components/index/IndexContent';
import LoadingState from '../components/index/LoadingState';

const Index: React.FC = () => {
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

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  // Pass proper function with assessment parameter for sendLatestToSheets
  const handleSendLatestToSheets = () => {
    if (latestAssessment) {
      sendLatestToSheets(latestAssessment);
    }
  };

  return (
    <Layout>
      <IndexContent
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
        sendLatestToSheets={handleSendLatestToSheets}
        configuringWorkloadIdentity={configuringWorkloadIdentity}
        isMobile={isMobile}
      />
    </Layout>
  );
};

export default Index;
