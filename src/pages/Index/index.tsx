
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '../../hooks/use-mobile';
import { HEARTIAssessment, UserProfile } from '../../types';
import { 
  getCurrentUser, 
  setUseSupabase, 
  getOrCreateAnonymousId,
} from '../../utils/localStorage';
import { getGoogleConnection } from '../../utils/googleAuth';
import { useAssessments } from './hooks/useAssessments';
import { useGoogleIntegration } from './hooks/useGoogleIntegration';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import IndexContent from './components/IndexContent';
import LoadingState from './components/LoadingState';

const Index: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'take' | 'results'>('take');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleConnection, setGoogleConnection] = useState<{connected: boolean, email?: string}>({ connected: false });
  
  // Custom hooks for different functionality
  const { 
    userAssessments,
    latestAssessment, 
    loadAssessments,
    handleAssessmentComplete
  } = useAssessments();
  
  const {
    testingSheets,
    configuringWorkloadIdentity,
    handleGoogleSignIn,
    handleConfigureWorkloadIdentity: configureWorkloadIdentity,
    testGoogleSheets,
    sendLatestToSheets: sendToSheets
  } = useGoogleIntegration();
  
  const {
    isSupabaseEnabled,
    syncDialogOpen,
    syncStatus,
    handleToggleSupabase,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose
  } = useSupabaseSync(loadAssessments, true);
  
  // Wrapper functions to pass the needed data
  const handleConfigureWorkloadIdentity = () => configureWorkloadIdentity(googleConnection);
  const sendLatestToSheets = () => sendToSheets(latestAssessment);
  
  // Handle assessment completion
  const onAssessmentComplete = (assessment: HEARTIAssessment) => {
    handleAssessmentComplete(assessment);
    
    // Switch to results tab
    setActiveTab('results');
    
    // Show success message with more specific information
    if (isSupabaseEnabled) {
      toast({
        title: "Assessment Complete!",
        description: "Your assessment has been saved and sent to Google Sheets. It may take a few moments to appear in the sheet.",
        duration: 5000,
      });
    } else {
      toast({
        title: "Assessment Complete!",
        description: "Your assessment has been saved locally. To send to Google Sheets, enable Cloud Storage.",
        duration: 5000,
      });
    }
  };
  
  useEffect(() => {
    const init = async () => {
      try {
        // Enable Supabase by default for Google Sheets integration
        const supabaseEnabled = true;
        setUseSupabase(supabaseEnabled);
        
        // Get or create anonymous ID
        const anonymousId = getOrCreateAnonymousId();
        console.log("Anonymous user ID:", anonymousId);
        
        // Get user profile - this should now work with the profile created above
        const userProfile = await getCurrentUser();
        setProfile(userProfile);
        
        // Check Google connection
        const connection = await getGoogleConnection();
        setGoogleConnection(connection);
        
        // Get assessment data
        await loadAssessments();
      } catch (error) {
        console.error('Error initializing:', error);
        toast({
          title: "Initialization Error",
          description: "There was a problem loading your data. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [toast, loadAssessments]);
  
  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  return (
    <Layout>
      <IndexContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        isMobile={isMobile}
        googleConnection={googleConnection}
        testingSheets={testingSheets}
        configuringWorkloadIdentity={configuringWorkloadIdentity}
        handleGoogleSignIn={handleGoogleSignIn}
        handleConfigureWorkloadIdentity={handleConfigureWorkloadIdentity}
        testGoogleSheets={testGoogleSheets}
        userAssessments={userAssessments}
        latestAssessment={latestAssessment}
        onComplete={onAssessmentComplete}
        sendLatestToSheets={sendLatestToSheets}
        isSupabaseEnabled={isSupabaseEnabled}
        handleToggleSupabase={handleToggleSupabase}
        syncDialogOpen={syncDialogOpen}
        syncStatus={syncStatus}
        handleConfirmSync={handleConfirmSync}
        handleCancelSync={handleCancelSync}
        handleSyncDialogClose={handleSyncDialogClose}
      />
    </Layout>
  );
};

export default Index;
