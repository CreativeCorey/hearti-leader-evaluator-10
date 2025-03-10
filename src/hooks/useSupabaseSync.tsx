
import { useState } from 'react';
import { useToast } from "./use-toast";
import { HEARTIAssessment } from '../types';
import { getUseSupabase, setUseSupabase, syncLocalDataToSupabase } from '../utils/localStorage';
import { saveAssessmentAndSyncToSheet } from '../utils/supabase/assessments';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

interface UseSupabaseSyncProps {
  loadAssessments: () => Promise<void>;
}

export const useSupabaseSync = (loadAssessments: () => Promise<void>) => {
  const { toast } = useToast();
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState<boolean>(getUseSupabase());
  const [syncDialogOpen, setSyncDialogOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  
  const handleToggleSupabase = (enabled: boolean) => {
    // If enabling Supabase and it wasn't enabled before, show sync dialog
    if (enabled && !isSupabaseEnabled) {
      setSyncDialogOpen(true);
      return;
    }
    
    // If disabling, just update the setting
    if (!enabled) {
      setUseSupabase(false);
      setIsSupabaseEnabled(false);
      
      toast({
        title: "Cloud Storage Disabled",
        description: "Your data will now be stored locally only.",
      });
    }
  };
  
  const handleConfirmSync = async () => {
    setSyncStatus('syncing');
    
    try {
      // Sync local data to Supabase
      const success = await syncLocalDataToSupabase();
      
      if (success) {
        // Update setting
        setUseSupabase(true);
        setIsSupabaseEnabled(true);
        setSyncStatus('success');
        
        // Reload assessments to get the latest from Supabase
        await loadAssessments();
        
        toast({
          title: "Cloud Storage Enabled",
          description: "Your data has been successfully synced to the cloud.",
        });
      } else {
        setSyncStatus('error');
        toast({
          title: "Sync Error",
          description: "There was a problem syncing your data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during sync:", error);
      setSyncStatus('error');
      
      toast({
        title: "Sync Error",
        description: "There was a problem syncing your data. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCancelSync = () => {
    setSyncDialogOpen(false);
    setSyncStatus('idle');
  };
  
  const handleSyncDialogClose = () => {
    setSyncDialogOpen(false);
    setSyncStatus('idle');
  };
  
  const sendLatestToSheets = async (latestAssessment: HEARTIAssessment): Promise<void> => {
    if (!latestAssessment) {
      toast({
        title: "No Assessment",
        description: "Please complete an assessment first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isSupabaseEnabled) {
      toast({
        title: "Cloud Storage Required",
        description: "Please enable cloud storage first to sync with Google Sheets.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Syncing...",
        description: "Sending assessment to Google Sheets.",
      });
      
      await saveAssessmentAndSyncToSheet(latestAssessment);
      
      toast({
        title: "Sync Complete",
        description: "Assessment has been sent to Google Sheets.",
      });
    } catch (error) {
      console.error("Error syncing to sheets:", error);
      
      toast({
        title: "Sync Error",
        description: "There was a problem syncing to Google Sheets. Please try again.",
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
