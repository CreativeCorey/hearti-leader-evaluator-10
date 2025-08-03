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
    const maxPolls = 600; // 10 minutes maximum

    const pollProgress = async () => {
      try {
        pollCount++;
        
        // Check database for recent imports to estimate progress
        const { data: recentProfiles } = await supabase
          .from('historical_profiles')
          .select('created_at')
          .gte('created_at', new Date(startTime).toISOString())
          .order('created_at', { ascending: false });

        const { data: recentAssessments } = await supabase
          .from('assessments')
          .select('date, historical_profile_id')
          .gte('date', new Date(startTime).toISOString())
          .not('historical_profile_id', 'is', null)
          .order('date', { ascending: false });

        const importedProfiles = recentProfiles?.length || 0;
        const importedAssessments = recentAssessments?.length || 0;
        const processedRecords = Math.max(importedProfiles, importedAssessments);

        // Calculate progress
        const progressPercentage = Math.min((processedRecords / totalRecords) * 100, 100);
        
        // Estimate time remaining
        const elapsed = Date.now() - startTime;
        const rate = processedRecords / (elapsed / 1000); // records per second
        const remaining = totalRecords - processedRecords;
        const estimatedTimeRemaining = rate > 0 ? Math.ceil(remaining / rate) : undefined;

        setProgress(progressPercentage);
        setStatus({
          status: progressPercentage >= 100 ? 'completed' : 'processing',
          processedRecords,
          importedProfiles,
          importedAssessments,
          errors: [],
          estimatedTimeRemaining
        });

        // Check if import is complete
        if (progressPercentage >= 100 || processedRecords >= totalRecords) {
          clearInterval(intervalId);
          setStatus(prev => ({ ...prev, status: 'completed' }));
          onComplete({
            success: true,
            imported: {
              profiles: importedProfiles,
              assessments: importedAssessments
            },
            totalRows: processedRecords
          });
        }

        // Timeout after max polls
        if (pollCount >= maxPolls) {
          clearInterval(intervalId);
          setStatus(prev => ({ ...prev, status: 'error' }));
          onError('Import timeout - process may still be running in background');
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

    // Start polling every second
    intervalId = setInterval(pollProgress, 1000);
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