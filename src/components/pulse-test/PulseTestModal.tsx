import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { HEARTIQuestion, HEARTIAnswer } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { calculatePulseTestScores } from '@/utils/pulseTestUtils';

interface PulseTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: HEARTIQuestion[];
  originalAssessmentId: string;
  onComplete: () => void;
}

export const PulseTestModal: React.FC<PulseTestModalProps> = ({
  isOpen,
  onClose,
  questions,
  originalAssessmentId,
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<HEARTIAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (score: number) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex].score = score;
    } else {
      newAnswers.push({ questionId: currentQuestion.id, score });
    }
    
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || answers.length !== questions.length) {
      toast({
        title: "Error",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { dimensionScores, overallScore } = calculatePulseTestScores(answers, questions);
      
      const { error } = await supabase
        .from('pulse_tests')
        .insert({
          user_id: user.id,
          original_assessment_id: originalAssessmentId,
          questions_selected: JSON.stringify(questions.map(q => q.id)),
          answers: JSON.stringify(answers),
          dimension_scores: JSON.stringify(dimensionScores),
          overall_score: overallScore
        });

      if (error) throw error;

      toast({
        title: "Pulse Test Complete!",
        description: "Your progress has been recorded. Thank you for staying engaged with your leadership development.",
      });

      onComplete();
      onClose();
    } catch (error) {
      console.error('Error submitting pulse test:', error);
      toast({
        title: "Error",
        description: "Failed to submit pulse test. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion.id)?.score || 3;
  };

  const getScoreLabel = (score: number): string => {
    switch (score) {
      case 1: return "Nearly Never";
      case 2: return "Rarely";
      case 3: return "Sometimes";
      case 4: return "Frequently";
      case 5: return "Almost Always";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            HEARTI Coach Pulse Test
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">
                    {currentQuestion.text}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dimension: {currentQuestion.dimension.charAt(0).toUpperCase() + currentQuestion.dimension.slice(1)}
                  </p>
                </div>

                <div className="space-y-4">
                  <Slider
                    value={[getCurrentAnswer()]}
                    onValueChange={(value) => handleAnswerChange(value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Nearly Never</span>
                    <span>Rarely</span>
                    <span>Sometimes</span>
                    <span>Frequently</span>
                    <span>Almost Always</span>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {getCurrentAnswer()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getScoreLabel(getCurrentAnswer())}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Pulse Test' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};