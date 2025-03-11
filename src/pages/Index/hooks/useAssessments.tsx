
import { useState } from 'react';
import { HEARTIAssessment } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserAssessments } from '@/utils/localStorage';

export const useAssessments = () => {
  const { toast } = useToast();
  const [userAssessments, setUserAssessments] = useState<HEARTIAssessment[]>([]);
  const [latestAssessment, setLatestAssessment] = useState<HEARTIAssessment | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const loadAssessments = async () => {
    try {
      setStatus('loading');
      
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
      
      setStatus('success');
    } catch (error) {
      console.error('Error loading assessments:', error);
      setStatus('error');
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
  };

  return {
    userAssessments,
    latestAssessment,
    loadAssessments,
    handleAssessmentComplete,
    status
  };
};
