
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { HEARTIAssessment, UserProfile } from '@/types';
import HeaderSection from '@/components/assessment/HeaderSection';
import AssessmentTabs from '@/components/assessment/AssessmentTabs';
import SyncDialog from '@/components/sync/SyncDialog';
import GoogleSheetsSetup from '@/components/google-integration/GoogleSheetsSetup';
import GoogleTroubleshooting from '@/components/google-integration/GoogleTroubleshooting';
import GoogleIntegrationTools from '@/components/google-integration/GoogleIntegrationTools';

interface IndexContentProps {
  // UI state
  activeTab: 'take' | 'results';
  setActiveTab: (tab: 'take' | 'results') => void;
  profile: UserProfile | null;
  isMobile: boolean;
  
  // Google integration
  googleConnection: { connected: boolean; email?: string };
  testingSheets: boolean;
  configuringWorkloadIdentity: boolean;
  handleGoogleSignIn: () => Promise<void>;
  handleConfigureWorkloadIdentity: () => Promise<void>;
  testGoogleSheets: () => Promise<void>;
  
  // Assessment data
  userAssessments: HEARTIAssessment[];
  latestAssessment: HEARTIAssessment | null;
  onComplete: (assessment: HEARTIAssessment) => void;
  sendLatestToSheets: () => void;
  
  // Supabase sync
  isSupabaseEnabled: boolean;
  handleToggleSupabase: (enabled: boolean) => void;
  syncDialogOpen: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  handleConfirmSync: () => Promise<void>;
  handleCancelSync: () => void;
  handleSyncDialogClose: () => void;
}

const IndexContent: React.FC<IndexContentProps> = ({
  activeTab,
  setActiveTab,
  profile,
  isMobile,
  googleConnection,
  testingSheets,
  configuringWorkloadIdentity,
  handleGoogleSignIn,
  handleConfigureWorkloadIdentity,
  testGoogleSheets,
  userAssessments,
  latestAssessment,
  onComplete,
  sendLatestToSheets,
  isSupabaseEnabled,
  handleToggleSupabase,
  syncDialogOpen,
  syncStatus,
  handleConfirmSync,
  handleCancelSync,
  handleSyncDialogClose
}) => {
  return (
    <div className={`container max-w-6xl mx-auto p-4 ${isMobile ? 'pt-20' : 'pt-8'}`}>
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
        onComplete={onComplete}
        testingSheets={testingSheets}
        sendLatestToSheets={sendLatestToSheets}
      />
      
      <GoogleSheetsSetup
        googleConnection={googleConnection}
        handleGoogleSignIn={handleGoogleSignIn}
        handleConfigureWorkloadIdentity={handleConfigureWorkloadIdentity}
        configuringWorkloadIdentity={configuringWorkloadIdentity}
        testGoogleSheets={testGoogleSheets}
        testingSheets={testingSheets}
      />
      
      <GoogleTroubleshooting />
      
      {/* Admin debug tools - only visible on results page */}
      {activeTab === 'results' && (
        <GoogleIntegrationTools 
          testGoogleSheets={testGoogleSheets}
          testingSheets={testingSheets}
        />
      )}
      
      <SyncDialog
        open={syncDialogOpen}
        onClose={handleSyncDialogClose}
        status={syncStatus}
        onConfirm={handleConfirmSync}
        onCancel={handleCancelSync}
      />
    </div>
  );
};

export default IndexContent;
