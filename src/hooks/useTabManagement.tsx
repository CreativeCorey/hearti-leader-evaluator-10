
import { useState, useEffect, useRef } from 'react';
import { HEARTIAssessment } from '../types';

interface UseTabManagementProps {
  userAssessments: HEARTIAssessment[];
  loading: boolean;
}

export const useTabManagement = ({ userAssessments, loading }: UseTabManagementProps) => {
  // Default to "take" tab to ensure assessment can be accessed
  const [activeTab, setActiveTab] = useState<'take' | 'results'>('take');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Auto-switch to results tab if user has assessments, but only on initial load
  useEffect(() => {
    if (!loading && !initialLoadComplete) {
      if (userAssessments.length > 0) {
        console.log("Initial load - switching to results tab due to existing assessment data");
        setActiveTab('results');
      }
      setInitialLoadComplete(true);
    }
  }, [userAssessments, loading, initialLoadComplete]);

  // This ensures that if a user explicitly clicks "Take Assessment", we respect that choice
  const setActiveTabWithPreference = (tab: 'take' | 'results') => {
    console.log(`User selected tab: ${tab}`);
    setActiveTab(tab);
  };

  return {
    activeTab,
    setActiveTab: setActiveTabWithPreference
  };
};
