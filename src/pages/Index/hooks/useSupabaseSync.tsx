
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { setUseSupabase, syncLocalDataToSupabase, getOrCreateAnonymousId } from '@/utils/localStorage';

export const useSupabaseSync = (
  loadAssessments: () => Promise<void>,
  initialSupabaseEnabled: boolean = true
) => {
  const { toast } = useToast();
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(initialSupabaseEnabled);
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

  return {
    isSupabaseEnabled,
    syncDialogOpen,
    syncStatus,
    handleToggleSupabase,
    handleConfirmSync,
    handleCancelSync,
    handleSyncDialogClose
  };
};
