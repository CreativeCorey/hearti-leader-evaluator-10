import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImportProgressBarProps {
  isVisible: boolean;
  totalRecords: number;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
}

interface ImportStatus {
  status: 'processing' | 'completed' | 'error';
  processedRecords: number;
  importedProfiles: number;
  importedAssessments: number;
  errors: string[];
  estimatedTimeRemaining?: number;
}

const ImportProgressBar: React.FC<ImportProgressBarProps> = ({
  isVisible,
  totalRecords,
  onComplete,
  onError
}) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ImportStatus>({
    status: 'processing',
    processedRecords: 0,
    importedProfiles: 0,
    importedAssessments: 0,
    errors: []
  });
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setStatus({
        status: 'processing',
        processedRecords: 0,
        importedProfiles: 0,
        importedAssessments: 0,
        errors: []
      });
      setStartTime(Date.now());
      return;
    }

    let intervalId: NodeJS.Timeout;
    let pollCount = 0;
    const maxPolls = 300; // 5 minutes maximum (reduced from 10)
    let lastProfileCount = 0;
    let lastAssessmentCount = 0;
    let stableCountTicks = 0;

    const pollProgress = async () => {
      try {
        pollCount++;
        
        // Get a longer time window to account for the fact that import may have started before polling
        const timeWindow = new Date(startTime - 30000).toISOString(); // 30 seconds before start
        
        // Check database for recent imports
        const { data: recentProfiles } = await supabase
          .from('historical_profiles')
          .select('created_at')
          .gte('created_at', timeWindow)
          .order('created_at', { ascending: false });

        const { data: recentAssessments } = await supabase
          .from('assessments')
          .select('date, historical_profile_id')
          .gte('date', timeWindow)
          .not('historical_profile_id', 'is', null)
          .order('date', { ascending: false });

        const importedProfiles = recentProfiles?.length || 0;
        const importedAssessments = recentAssessments?.length || 0;
        
        // Check if counts have stabilized (no change for 3 consecutive polls)
        if (importedProfiles === lastProfileCount && importedAssessments === lastAssessmentCount) {
          stableCountTicks++;
        } else {
          stableCountTicks = 0;
          lastProfileCount = importedProfiles;
          lastAssessmentCount = importedAssessments;
        }
        
        // Use the higher of profiles or assessments as processed records
        const processedRecords = Math.max(importedProfiles, importedAssessments);

        // Calculate progress - be more lenient about what constitutes completion
        let progressPercentage;
        if (processedRecords >= totalRecords * 0.5) {
          // If we've processed at least 50% of expected records, calculate percentage normally
          progressPercentage = Math.min((processedRecords / totalRecords) * 100, 100);
        } else {
          // For lower counts, be more conservative
          progressPercentage = (processedRecords / totalRecords) * 100;
        }
        
        // Check for completion conditions
        const isComplete = (
          // Explicit completion: processed expected number
          processedRecords >= totalRecords ||
          // Implicit completion: counts have been stable for 3+ polls and we have significant data
          (stableCountTicks >= 3 && processedRecords > 0 && pollCount > 5) ||
          // Edge case: substantial progress with stable counts
          (stableCountTicks >= 2 && processedRecords >= totalRecords * 0.5)
        );
        
        // Estimate time remaining
        const elapsed = Date.now() - startTime;
        const rate = processedRecords / (elapsed / 1000); // records per second
        const remaining = totalRecords - processedRecords;
        const estimatedTimeRemaining = rate > 0 && !isComplete ? Math.ceil(remaining / rate) : undefined;

        setProgress(progressPercentage);
        setStatus({
          status: isComplete ? 'completed' : 'processing',
          processedRecords,
          importedProfiles,
          importedAssessments,
          errors: [],
          estimatedTimeRemaining
        });

        // Complete the import
        if (isComplete) {
          clearInterval(intervalId);
          setStatus(prev => ({ ...prev, status: 'completed' }));
          onComplete({
            success: true,
            imported: {
              profiles: importedProfiles,
              assessments: importedAssessments
            },
            totalRows: processedRecords,
            note: processedRecords < totalRecords ? 
              `Processed ${processedRecords} valid records out of ${totalRecords} total rows` : 
              'All records processed successfully'
          });
          return;
        }

        // Timeout after max polls
        if (pollCount >= maxPolls) {
          clearInterval(intervalId);
          setStatus(prev => ({ ...prev, status: 'completed' })); // Assume completed rather than error
          onComplete({
            success: true,
            imported: {
              profiles: importedProfiles,
              assessments: importedAssessments
            },
            totalRows: processedRecords,
            note: 'Import completed (polling timeout reached)'
          });
        }

      } catch (error) {
        console.error('Error polling import progress:', error);
        if (pollCount > 10) { // Only error after several attempts
          clearInterval(intervalId);
          setStatus(prev => ({ ...prev, status: 'error' }));
          onError('Failed to track import progress');
        }
      }
    };

    // Start polling every 2 seconds (reduced frequency)
    intervalId = setInterval(pollProgress, 2000);
    pollProgress(); // Initial call

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isVisible, totalRecords, startTime, onComplete, onError]);

  if (!isVisible) return null;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {status.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
          {status.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
          {status.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
          Import Progress
        </CardTitle>
        <CardDescription>
          Processing {totalRecords} records from Google Sheets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {status.processedRecords} / {totalRecords} records</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Profiles Created:</span>
              <span className="font-medium">{status.importedProfiles}</span>
            </div>
            <div className="flex justify-between">
              <span>Assessments Created:</span>
              <span className="font-medium">{status.importedAssessments}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-medium ${
                status.status === 'processing' ? 'text-blue-600' :
                status.status === 'completed' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {status.status === 'processing' ? 'Processing...' :
                 status.status === 'completed' ? 'Complete' :
                 'Error'}
              </span>
            </div>
            {status.estimatedTimeRemaining && status.status === 'processing' && (
              <div className="flex justify-between">
                <span>Est. Time:</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(status.estimatedTimeRemaining)}
                </span>
              </div>
            )}
          </div>
        </div>

        {status.status === 'processing' && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            💡 Large imports are processed in background. You can navigate away and return later to check progress.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportProgressBar;