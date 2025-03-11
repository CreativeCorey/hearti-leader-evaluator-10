
import { useState, useEffect } from 'react';
import { HEARTIAssessment } from '../types';

interface UseTabManagementProps {
  userAssessments: HEARTIAssessment[];
  loading: boolean;
}

export const useTabManagement = ({ userAssessments, loading }: UseTabManagementProps) => {
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

  return {
    activeTab,
    setActiveTab
  };
};
