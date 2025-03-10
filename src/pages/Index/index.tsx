
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { HEARTIAssessment, UserProfile } from "@/types";
import IndexContent from "./components/IndexContent";
import { useAssessments } from "./hooks/useAssessments";
import { useGoogleIntegration } from "./hooks/useGoogleIntegration";
import { useSupabaseSync } from "./hooks/useSupabaseSync";
import LoadingState from "./components/LoadingState";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"take" | "results">("take");
  const { anonymousId, user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { 
    userAssessments, 
    currentAssessment, 
    setCurrentAssessment, 
    setUserAssessments,
    assessmentStatus,
    loadAssessments
  } = useAssessments();

  const { 
    testingSheets, 
    configuringWorkloadIdentity, 
    handleGoogleSignIn, 
    handleConfigureWorkloadIdentity, 
    testGoogleSheets, 
    sendLatestToSheets 
  } = useGoogleIntegration();
  
  // Create googleConnection object as required by useSupabaseSync hook
  const googleConnection = {
    connected: false,
    email: user?.email || undefined
  };
  
  const { 
    syncStatus, 
    triggerSync, 
    setSyncSettings, 
    syncSettings 
  } = useSupabaseSync({ googleConnection, handleConfigureWorkloadIdentity, loadAssessments });

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  // Create a profile object with required properties
  const profile: UserProfile = {
    id: user?.id || anonymousId,
    name: user?.user_metadata?.name || "Anonymous User",
    email: user?.email || "anonymous@example.com",
    createdAt: new Date().toISOString(),
    // Add other required fields with default values
    organization: user?.user_metadata?.organization || "",
    role: "user",
    organization_id: null,
    updated_at: new Date().toISOString(),
    marketing_consent: user?.user_metadata?.marketing_consent || false
  };

  // Wrapper function to pass the required parameter to handleConfigureWorkloadIdentity
  const handleWorkloadIdentityConfig = () => {
    return handleConfigureWorkloadIdentity({
      connected: !!user,
      email: user?.email
    });
  };

  return (
    <Layout>
      <IndexContent
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userAssessments={userAssessments}
        currentAssessment={currentAssessment}
        setCurrentAssessment={setCurrentAssessment}
        assessmentStatus={assessmentStatus}
        setUserAssessments={setUserAssessments}
        handleGoogleSignIn={handleGoogleSignIn}
        testGoogleSheets={testGoogleSheets}
        testingSheets={testingSheets}
        configuringWorkloadIdentity={configuringWorkloadIdentity}
        handleConfigureWorkloadIdentity={handleWorkloadIdentityConfig}
        triggerSync={triggerSync}
        syncStatus={syncStatus}
        setSyncSettings={setSyncSettings}
        syncSettings={syncSettings}
        sendLatestToSheets={sendLatestToSheets}
        isMobile={isMobile}
      />
    </Layout>
  );
};

export default Index;
