
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { UserProfile } from '../types';
import { getUserProfile, setUseSupabase, getOrCreateAnonymousId } from '../utils/localStorage';

interface UseAppInitializationProps {
  loadAssessments: () => Promise<void>;
}

export const useAppInitialization = ({ loadAssessments }: UseAppInitializationProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize app
  const initializeApp = useCallback(async () => {
    if (initialized) return; // Prevent multiple initializations
    
    try {
      console.log("Initializing app...");
      // Enable Supabase by default for Google Sheets integration
      const supabaseEnabled = true;
      setUseSupabase(supabaseEnabled);
      
      // Get or create anonymous ID
      const anonymousId = getOrCreateAnonymousId();
      console.log("Anonymous user ID:", anonymousId);
      
      // Get user profile
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      
      // Load assessment data
      await loadAssessments();
      
      setInitialized(true);
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
  }, [toast, loadAssessments, initialized]);

  // Initialize app once on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return {
    loading,
    profile,
    initialized
  };
};
