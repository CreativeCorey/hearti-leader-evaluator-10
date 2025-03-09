
import React from 'react';
import { HEARTIAssessment, UserProfile } from '@/types';
import HeaderSection from '@/components/assessment/HeaderSection';
import AssessmentTabs from '@/components/assessment/AssessmentTabs';
import SyncDialog from '@/components/sync/SyncDialog';

interface IndexContentProps {
  profile: UserProfile | null;
  activeTab: 'take' | 'results';
  setActiveTab: (tab: 'take' | 'results') => void;
  userAssessments: HEARTIAssessment[];
  latestAssessment: HEARTIAssessment | null;
  googleConnection: { connected: boolean; email?: string };
  isSupabaseEnabled: boolean;
  testingSheets: boolean;
  syncDialogOpen: boolean;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  handleToggleSupabase: (enabled: boolean) => void;
  handleAssessmentComplete: (assessment: HEARTIAssessment) => void;
  handleConfirmSync: () => Promise<void>;
  handleCancelSync: () => void;
  handleSyncDialogClose: () => void;
  handleGoogleSignIn: () => Promise<void>;
  handleConfigureWorkloadIdentity: () => Promise<void>;
  testGoogleSheets: () => Promise<void>;
  sendLatestToSheets: () => void;
  configuringWorkloadIdentity: boolean;
  isMobile: boolean;
}

const IndexContent: React.FC<IndexContentProps> = ({
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
  sendLatestToSheets,
  isMobile
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
        onComplete={handleAssessmentComplete}
        testingSheets={testingSheets}
        sendLatestToSheets={sendLatestToSheets}
      />
      
      {/* Debug and development tools are hidden */}
      
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
