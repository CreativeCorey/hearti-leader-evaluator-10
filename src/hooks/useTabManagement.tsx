
import { useState, useEffect, useRef } from 'react';
import { HEARTIAssessment, AssessmentTab } from '../types';

interface UseTabManagementProps {
  userAssessments: HEARTIAssessment[];
  loading: boolean;
}

export const useTabManagement = ({ userAssessments, loading }: UseTabManagementProps) => {
  // Default to "take" tab to ensure assessment can be accessed
  const [activeTab, setActiveTab] = useState<AssessmentTab>('take');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Auto-switch to results tab if user has assessments, but only on initial load
  useEffect(() => {
    if (!loading && !initialLoadComplete) {
      if (userAssessments.length > 0) {
        console.log("Initial load - switching to overview tab due to existing assessment data");
        setActiveTab('overview');
      }
      setInitialLoadComplete(true);
    }
  }, [userAssessments, loading, initialLoadComplete]);

  // This ensures that if a user explicitly clicks "Take Assessment", we respect that choice
  const setActiveTabWithPreference = (tab: AssessmentTab) => {
    console.log(`User selected tab: ${tab}`);
    setActiveTab(tab);
  };

  return {
    activeTab,
    setActiveTab: setActiveTabWithPreference
  };
};
