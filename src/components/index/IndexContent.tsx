
import React from 'react';
import { HEARTIAssessment, UserProfile } from '@/types';
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
  sendLatestToSheets: (assessment?: HEARTIAssessment) => Promise<void>;
  configuringWorkloadIdentity: boolean;
  isMobile: boolean;
  viewTransitioning?: boolean;
}

const IndexContent: React.FC<IndexContentProps> = ({
  activeTab,
  setActiveTab,
  userAssessments,
  latestAssessment,
  testingSheets,
  syncDialogOpen,
  syncStatus,
  handleAssessmentComplete,
  handleConfirmSync,
  handleCancelSync,
  handleSyncDialogClose,
  sendLatestToSheets,
  viewTransitioning
}) => {
  return (
    <>
      <AssessmentTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userAssessments={userAssessments}
        latestAssessment={latestAssessment}
        onComplete={handleAssessmentComplete}
        testingSheets={testingSheets}
        sendLatestToSheets={() => latestAssessment && sendLatestToSheets(latestAssessment)}
        viewTransitioning={viewTransitioning}
      />
      
      <SyncDialog
        open={syncDialogOpen}
        onClose={handleSyncDialogClose}
        status={syncStatus}
        onConfirm={handleConfirmSync}
        onCancel={handleCancelSync}
      />
    </>
  );
};

export default IndexContent;
