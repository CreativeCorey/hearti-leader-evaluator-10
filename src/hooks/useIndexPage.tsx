
import { useState, useEffect, useCallback } from 'react';
import { HEARTIAssessment } from '../types';
import { useToast } from './use-toast';
import { getUserProfile, setUseSupabase, getOrCreateAnonymousId } from '../utils/localStorage';
import { useViewTransitions } from './useViewTransitions';
import { useAppInitialization } from './useAppInitialization';
import { useTabManagement } from './useTabManagement';

interface UseIndexPageProps {
  loadAssessments: () => Promise<void>;
  userAssessments: HEARTIAssessment[];
}

export const useIndexPage = ({ loadAssessments, userAssessments }: UseIndexPageProps) => {
  const [loading, setLoading] = useState(true);
  
  // Use the extracted hooks
  const { isMobile, viewTransitioning } = useViewTransitions();
  const { initialized } = useAppInitialization({ loadAssessments });
  const { activeTab, setActiveTab } = useTabManagement({ 
    userAssessments, 
    loading 
  });

  // Sync the loading state based on initialization
  useEffect(() => {
    if (initialized) {
      setLoading(false);
    }
  }, [initialized]);

  return {
    loading,
    activeTab,
    setActiveTab,
    isMobile,
    viewTransitioning
  };
};
