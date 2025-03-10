
import { useState, useEffect } from 'react';
import { useToast } from "./use-toast";
import { HEARTIAssessment } from '../types';
import { getCurrentUserAssessments } from '../utils/localStorage';

export const useAssessments = () => {
  const { toast } = useToast();
  const [latestAssessment, setLatestAssessment] = useState<HEARTIAssessment | null>(null);
  const [currentAssessment, setCurrentAssessment] = useState<HEARTIAssessment | null>(null);
  const [userAssessments, setUserAssessments] = useState<HEARTIAssessment[]>([]);
  const [assessmentStatus, setAssessmentStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const loadAssessments = async () => {
    try {
      setAssessmentStatus('loading');
      // Fetch user assessments
      const assessments = await getCurrentUserAssessments();
      
      if (assessments.length > 0) {
        // Sort by date (newest first)
        const sortedAssessments = [...assessments].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setUserAssessments(sortedAssessments);
        setLatestAssessment(sortedAssessments[0]);
        
        // If no current assessment is selected, set the latest one
        if (!currentAssessment) {
          setCurrentAssessment(sortedAssessments[0]);
        }
        
        setAssessmentStatus('success');
      } else {
        setUserAssessments([]);
        setLatestAssessment(null);
        setCurrentAssessment(null);
        setAssessmentStatus('success');
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
      setAssessmentStatus('error');
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
    setCurrentAssessment(assessment);
    setUserAssessments(prev => [assessment, ...prev]);
  };

  return {
    latestAssessment,
    currentAssessment,
    setCurrentAssessment,
    userAssessments,
    setUserAssessments,
    assessmentStatus,
    loadAssessments,
    handleAssessmentComplete
  };
};
