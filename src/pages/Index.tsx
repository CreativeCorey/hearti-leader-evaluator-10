
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import HeartiLogo from '../assets/hearti-logo.svg';
import { useToast } from "@/hooks/use-toast";
import { 
  getCurrentUser, 
  getCurrentUserAssessments, 
  setUseSupabase, 
  useSupabase,
  syncLocalDataToSupabase,
  getOrCreateAnonymousId,
  ensureUserExists
} from '../utils/localStorage';
import { ensureUserProfileExists } from '../utils/supabaseHelpers';
import { HEARTIAssessment, UserProfile } from '../types';
import AssessmentForm from '../components/AssessmentForm';
import ResultsDisplay from '../components/ResultsDisplay';
import HistoricalResults from '../components/HistoricalResults';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Toggle } from '@/components/ui/toggle';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const Index: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'take' | 'results'>('take');
  const [latestAssessment, setLatestAssessment] = useState<HEARTIAssessment | null>(null);
  const [userAssessments, setUserAssessments] = useState<HEARTIAssessment[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  
  useEffect(() => {
    const init = async () => {
      try {
        // Check if Supabase integration is enabled
        const supabseEnabled = useSupabase();
        setIsSupabaseEnabled(supabseEnabled);
        
        // Ensure user exists in Supabase if using it
        if (supabseEnabled) {
          // Get or create anonymous ID
          const anonymousId = getOrCreateAnonymousId();
          console.log("Anonymous user ID:", anonymousId);
          
          // Ensure this ID has a profile in Supabase
          const profileCreated = await ensureUserProfileExists(anonymousId);
          console.log("Profile exists or was created:", profileCreated);
          
          if (!profileCreated) {
            toast({
              title: "Profile Creation Error",
              description: "Could not create or verify your user profile. Some features may be limited.",
              variant: "destructive",
            });
          }
        }
        
        // Get user profile - this should now work with the profile created above
        const userProfile = await getCurrentUser();
        setProfile(userProfile);
        
        // Get assessment data
        await loadAssessments();
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
    };
    
    init();
  }, [toast]);
  
  const loadAssessments = async () => {
    try {
      // Fetch user assessments
      const assessments = await getCurrentUserAssessments();
      
      if (assessments.length > 0) {
        // Sort by date (newest first)
        const sortedAssessments = [...assessments].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setUserAssessments(sortedAssessments);
        setLatestAssessment(sortedAssessments[0]);
      } else {
        setUserAssessments([]);
        setLatestAssessment(null);
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load assessment data",
        variant: "destructive",
      });
    }
  };
  
  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    // Update the latest assessment and user assessments list
    setLatestAssessment(assessment);
    setUserAssessments(prev => [assessment, ...prev]);
    
    // Switch to results tab
    setActiveTab('results');
    
    // Show success message
    toast({
      title: "Assessment Complete!",
      description: "Your HEARTI Leadership Assessment has been saved.",
    });
  };
  
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
        description: "Your data will now be stored locally in this browser.",
      });
    }
  };
  
  const handleConfirmSync = async () => {
    setSyncStatus('syncing');
    
    try {
      // Get or create anonymous ID and ensure profile exists first
      const anonymousId = getOrCreateAnonymousId();
      await ensureUserProfileExists(anonymousId);
      
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
          title: "Supabase storage enabled",
          description: "Your data has been synced to Supabase successfully.",
        });
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      
      toast({
        title: "Sync Failed",
        description: "Could not sync your data to Supabase. Staying on local storage.",
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
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg">Loading data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`container max-w-6xl mx-auto p-4 ${isMobile ? 'pt-20' : 'pt-8'}`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">HEARTI Leadership Assessment</h1>
            <p className="text-muted-foreground mt-1">
              Measure your growth in Humility, Empathy, Accountability, Resiliency, Transparency, and Inclusivity
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Toggle
              pressed={isSupabaseEnabled}
              onPressedChange={handleToggleSupabase}
              className="data-[state=on]:bg-blue-500 px-4"
            >
              {isSupabaseEnabled ? 'Cloud Storage' : 'Local Storage'}
            </Toggle>
            
            {profile && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="p-2">
                  {profile.email || 'Anonymous user'}
                </Badge>
                
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    {profile.email ? 'Account' : 'Sign In'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'take' | 'results')}>
          <TabsList className="mb-8">
            <TabsTrigger value="take" className="flex-1">Take Assessment</TabsTrigger>
            <TabsTrigger value="results" className="flex-1" disabled={userAssessments.length === 0}>View Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="take">
            <AssessmentForm onComplete={handleAssessmentComplete} />
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-8">
              {latestAssessment && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Latest Assessment Results</h2>
                  <ResultsDisplay assessment={latestAssessment} />
                </div>
              )}
              
              {userAssessments.length > 1 && (
                <div>
                  <Separator className="my-8" />
                  <h2 className="text-xl font-bold mb-4">Assessment History</h2>
                  <HistoricalResults 
                    assessments={userAssessments} 
                    onSelect={(assessment) => setLatestAssessment(assessment)} 
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={syncDialogOpen} onOpenChange={handleSyncDialogClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sync Local Data to Cloud Storage</DialogTitle>
              <DialogDescription>
                Would you like to sync your existing local data to Supabase cloud storage? 
                This allows you to access your assessments from any device.
              </DialogDescription>
            </DialogHeader>
            
            {syncStatus === 'syncing' ? (
              <div className="py-6 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p>Syncing your data to the cloud...</p>
              </div>
            ) : syncStatus === 'success' ? (
              <div className="py-6 text-center text-green-600">
                <p className="font-medium">Sync completed successfully!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your data is now available in cloud storage.
                </p>
              </div>
            ) : syncStatus === 'error' ? (
              <div className="py-6 text-center text-red-600">
                <p className="font-medium">Sync failed</p>
                <p className="text-sm text-muted-foreground mt-2">
                  There was an error syncing your data. Please try again.
                </p>
              </div>
            ) : (
              <div className="py-4">
                <p className="mb-2">This will copy your:</p>
                <ul className="list-disc pl-6 mb-4 text-sm">
                  <li>Assessment results and history</li>
                  <li>User profile information</li>
                  <li>Organization information (if any)</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  You can switch back to local storage at any time, but data synchronized to the cloud
                  will remain there.
                </p>
              </div>
            )}
            
            {syncStatus === 'idle' && (
              <DialogFooter>
                <Button variant="outline" onClick={handleCancelSync}>Cancel</Button>
                <Button onClick={handleConfirmSync}>Sync Now</Button>
              </DialogFooter>
            )}
            
            {(syncStatus === 'success' || syncStatus === 'error') && (
              <DialogFooter>
                <Button onClick={handleSyncDialogClose}>Close</Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Index;
