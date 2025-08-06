import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';
import { PulseTest, AssessmentSchedule } from '@/types/pulseTest';
import { selectPulseTestQuestions, shouldShowPulseTest, shouldShowFullAssessment, calculateNextDates } from '@/utils/pulseTestUtils';

export const usePulseTest = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentSchedule, setAssessmentSchedule] = useState<AssessmentSchedule | null>(null);
  const [pulseTests, setPulseTests] = useState<PulseTest[]>([]);
  const [showPulseTestModal, setShowPulseTestModal] = useState(false);

  // Load assessment schedule and pulse tests
  const loadPulseTestData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load assessment schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('assessment_schedule')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (scheduleError && scheduleError.code !== 'PGRST116') {
        throw scheduleError;
      }

      if (scheduleData) {
        const mappedSchedule: AssessmentSchedule = {
          id: scheduleData.id,
          userId: scheduleData.user_id,
          initialAssessmentId: scheduleData.initial_assessment_id,
          initialAssessmentDate: scheduleData.initial_assessment_date,
          nextPulseDate: scheduleData.next_pulse_date,
          nextFullAssessmentDate: scheduleData.next_full_assessment_date,
          pulseCount: scheduleData.pulse_count,
          createdAt: scheduleData.created_at,
          updatedAt: scheduleData.updated_at
        };
        setAssessmentSchedule(mappedSchedule);
      }

      // Load pulse tests
      const { data: pulseData, error: pulseError } = await supabase
        .from('pulse_tests')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (pulseError) throw pulseError;

      if (pulseData) {
        const mappedPulseTests: PulseTest[] = pulseData.map(pulse => ({
          id: pulse.id,
          userId: pulse.user_id,
          originalAssessmentId: pulse.original_assessment_id,
          date: pulse.date,
          questionsSelected: JSON.parse(pulse.questions_selected as string),
          answers: JSON.parse(pulse.answers as string),
          dimensionScores: JSON.parse(pulse.dimension_scores as string),
          overallScore: pulse.overall_score,
          createdAt: pulse.created_at,
          updatedAt: pulse.updated_at
        }));
        setPulseTests(mappedPulseTests);
      }
    } catch (error) {
      console.error('Error loading pulse test data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create or update assessment schedule when user completes an assessment
  const createOrUpdateSchedule = async (assessment: HEARTIAssessment) => {
    if (!user) return;

    try {
      const { nextPulseDate, nextFullAssessmentDate } = calculateNextDates(assessment.date);

      const scheduleData = {
        user_id: user.id,
        initial_assessment_id: assessment.id,
        initial_assessment_date: assessment.date,
        next_pulse_date: nextPulseDate,
        next_full_assessment_date: nextFullAssessmentDate,
        pulse_count: 0
      };

      const { error } = await supabase
        .from('assessment_schedule')
        .upsert(scheduleData, { onConflict: 'user_id' });

      if (error) throw error;

      await loadPulseTestData();
    } catch (error) {
      console.error('Error creating assessment schedule:', error);
    }
  };

  // Update schedule after pulse test completion
  const updateScheduleAfterPulseTest = async () => {
    if (!assessmentSchedule || !user) return;

    try {
      const { nextPulseDate } = calculateNextDates(new Date().toISOString());

      const { error } = await supabase
        .from('assessment_schedule')
        .update({
          next_pulse_date: nextPulseDate,
          pulse_count: assessmentSchedule.pulseCount + 1
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await loadPulseTestData();
    } catch (error) {
      console.error('Error updating assessment schedule:', error);
    }
  };

  // Check if pulse test should be shown
  const shouldShowPulseTestBanner = (): boolean => {
    if (!assessmentSchedule) return false;
    return shouldShowPulseTest(assessmentSchedule.nextPulseDate);
  };

  // Check if full assessment should be shown
  const shouldShowFullAssessmentBanner = (): boolean => {
    if (!assessmentSchedule) return false;
    return shouldShowFullAssessment(assessmentSchedule.initialAssessmentDate);
  };

  // Get days since last assessment
  const getDaysSinceLastAssessment = (): number => {
    if (!assessmentSchedule) return 0;
    
    const lastDate = pulseTests.length > 0 
      ? new Date(pulseTests[0].date) 
      : new Date(assessmentSchedule.initialAssessmentDate);
    
    const now = new Date();
    return Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Start pulse test
  const startPulseTest = () => {
    setShowPulseTestModal(true);
  };

  // Get selected questions for pulse test
  const getPulseTestQuestions = () => {
    return selectPulseTestQuestions();
  };

  useEffect(() => {
    if (user) {
      loadPulseTestData();
    }
  }, [user]);

  return {
    isLoading,
    assessmentSchedule,
    pulseTests,
    showPulseTestModal,
    setShowPulseTestModal,
    createOrUpdateSchedule,
    updateScheduleAfterPulseTest,
    shouldShowPulseTestBanner,
    shouldShowFullAssessmentBanner,
    getDaysSinceLastAssessment,
    startPulseTest,
    getPulseTestQuestions,
    loadPulseTestData
  };
};