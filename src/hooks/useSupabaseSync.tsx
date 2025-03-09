import { useState } from 'react';
import { useToast } from "./use-toast";
import { setUseSupabase, getOrCreateAnonymousId } from '../utils/localStorage';
import { syncLocalDataToSupabase } from '../utils/localStorage';
import { supabase } from '../integrations/supabase/client';
import { HEARTIAssessment } from '../types';

export const useSupabaseSync = (loadAssessments: () => Promise<void>) => {
  const { toast } = useToast();
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(true);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  const handleToggleSupabase = async (enabled: boolean) => {
    if (enabled) {
      // If enabling Supabase, offer to sync local data
      setSyncDialogOpen(true);
    } else {
      // If disabling Supabase, just update the setting
      setUseSupabase(false);
      setIsSupabaseEnabled(false);
      
      toast({
        title: "Local storage enabled",
        description: "Your data will now be stored locally in this browser. Google Sheets integration is disabled.",
      });
    }
  };
  
  const handleConfirmSync = async () => {
    setSyncStatus('syncing');
    
    try {
      // Get or create anonymous ID and ensure profile exists first
      getOrCreateAnonymousId();
      
      // Then sync data from localStorage to Supabase
      const success = await syncLocalDataToSupabase();
      
      if (success) {
        // Update UI state
        setUseSupabase(true);
        setIsSupabaseEnabled(true);
        setSyncStatus('success');
        
        // Reload assessments to get from Supabase
        await loadAssessments();
        
        toast({
          title: "Cloud storage enabled",
          description: "Your data has been synced to cloud storage, and Google Sheets integration is now active.",
        });
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      
      toast({
        title: "Sync Failed",
        description: "Could not sync your data to cloud storage. Google Sheets integration may not work properly.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancelSync = () => {
    setSyncDialogOpen(false);
  };
  
  const handleSyncDialogClose = () => {
    setSyncDialogOpen(false);
    setSyncStatus('idle');
  };

  const sendLatestToSheets = async (latestAssessment: HEARTIAssessment | null) => {
    if (!latestAssessment) {
      toast({
        title: "No Assessment Available",
        description: "Please complete an assessment first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Directly call the sync function with the latest assessment
      const { data, error } = await supabase.functions.invoke('sync-assessment-to-sheet', {
        body: {
          user_id: latestAssessment.userId,
          date: latestAssessment.date,
          overall_score: latestAssessment.overallScore,
          dimension_scores: latestAssessment.dimensionScores,
          demographics: latestAssessment.demographics,
          manual_sync: true
        }
      });
      
      if (error) {
        console.error('Error syncing to Google Sheets:', error);
        toast({
          title: "Sync Failed",
          description: "Could not send your assessment to Google Sheets.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('Google Sheets sync response:', data);
      
      toast({
        title: "Assessment Sent",
        description: "Your assessment has been manually sent to Google Sheets.",
      });
    } catch (error) {
      console.error('Error during manual sync:', error);
      toast({
        title: "Sync Error",
        description: "An unexpected error occurred during the sync attempt.",
        variant: "destructive",
      });
    }
  };

  return {
    isSupabaseEnabled,
    syncDialogOpen,
    syncStatus,
    handleToggleSupabase,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose,
    sendLatestToSheets
  };
};
