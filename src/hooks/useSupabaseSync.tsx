
import { useState } from 'react';
import { useToast } from "./use-toast";
import { saveAssessmentAndSyncToSheet } from '../utils/supabase';
import { getUseSupabase, setUseSupabase } from '../utils/localStorage';
import { HEARTIAssessment } from '@/types';

export const useSupabaseSync = (reloadAssessments: () => Promise<void>) => {
  const { toast } = useToast();
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(getUseSupabase());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Function to send latest assessment to Google Sheets
  const sendLatestToSheets = async (latestAssessment: HEARTIAssessment) => {
    if (!latestAssessment) {
      toast({
        title: "No assessments found",
        description: "Complete an assessment first to send to Google Sheets.",
        variant: "destructive",
      });
      return;
    }

    // If Supabase is not enabled, show confirmation dialog
    if (!isSupabaseEnabled) {
      setSyncDialogOpen(true);
      return;
    }

    // If already enabled, sync directly
    try {
      setSyncStatus('syncing');
      await saveAssessmentAndSyncToSheet(latestAssessment);
      setSyncStatus('success');
      
      toast({
        title: "Sync Successful",
        description: "Your assessment has been sent to Google Sheets.",
      });
    } catch (error) {
      console.error("Error syncing to sheets:", error);
      setSyncStatus('error');
      
      toast({
        title: "Sync Failed",
        description: "There was a problem sending your assessment to Google Sheets.",
        variant: "destructive",
      });
    }
  };

  // Function to toggle Supabase storage
  const handleToggleSupabase = (enabled: boolean) => {
    if (enabled === isSupabaseEnabled) return;
    
    if (enabled) {
      // If enabling, show confirmation dialog
      setSyncDialogOpen(true);
    } else {
      // If disabling, update right away
      setUseSupabase(false);
      setIsSupabaseEnabled(false);
      toast({
        title: "Cloud Storage Disabled",
        description: "Your assessments will now be stored locally only.",
      });
    }
  };

  // Function to confirm sync when dialog is accepted
  const handleConfirmSync = async () => {
    setUseSupabase(true);
    setIsSupabaseEnabled(true);
    setSyncDialogOpen(false);
    
    // Reload assessments to sync data
    await reloadAssessments();
    
    toast({
      title: "Cloud Storage Enabled",
      description: "Your assessments will now be stored and synced across devices.",
    });
  };

  const handleCancelSync = () => {
    setSyncDialogOpen(false);
  };

  const handleSyncDialogClose = () => {
    setSyncDialogOpen(false);
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
