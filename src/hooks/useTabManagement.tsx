
import { useState, useEffect } from 'react';
import { HEARTIAssessment } from '../types';

interface UseTabManagementProps {
  userAssessments: HEARTIAssessment[];
  loading: boolean;
}

export const useTabManagement = ({ userAssessments, loading }: UseTabManagementProps) => {
  const [activeTab, setActiveTab] = useState<'take' | 'results'>('take');
  
  // Auto-switch to results tab if user has assessments
  useEffect(() => {
    if (!loading && userAssessments.length > 0 && activeTab === 'take') {
      console.log("Auto-switching to results tab due to existing assessment data");
      setActiveTab('results');
    }
  }, [userAssessments, activeTab, loading]);

  return {
    activeTab,
    setActiveTab
  };
};
