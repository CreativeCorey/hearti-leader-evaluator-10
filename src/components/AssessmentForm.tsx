
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { 
  HEARTIQuestion, 
  HEARTIAnswer, 
  HEARTIAssessment,
  HEARTIDimension
} from '../types';
import { calculateDimensionScores, calculateOverallScore } from '../utils/calculations';
import { saveAssessment } from '../utils/localStorage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Questions for the assessment
const questions: HEARTIQuestion[] = [
  // Humility
  { id: 1, dimension: 'humility', text: 'I acknowledge my mistakes openly and learn from them.' },
  { id: 2, dimension: 'humility', text: 'I seek feedback regularly and implement it to improve.' },
  { id: 3, dimension: 'humility', text: 'I recognize the strengths and contributions of others without feeling threatened.' },
  
  // Empathy
  { id: 4, dimension: 'empathy', text: 'I actively listen to understand others\' perspectives and feelings.' },
  { id: 5, dimension: 'empathy', text: 'I consider how my decisions and actions affect others emotionally.' },
  { id: 6, dimension: 'empathy', text: 'I respond compassionately to team members going through challenges.' },
  
  // Accountability
  { id: 7, dimension: 'accountability', text: 'I take responsibility for the outcomes of my decisions, whether positive or negative.' },
  { id: 8, dimension: 'accountability', text: 'I follow through on commitments I make to my team.' },
  { id: 9, dimension: 'accountability', text: 'I establish clear expectations and hold myself and others to those standards.' },
  
  // Resiliency
  { id: 10, dimension: 'resiliency', text: 'I adapt well to unexpected changes and challenges.' },
  { id: 11, dimension: 'resiliency', text: 'I maintain a positive attitude even during difficult times.' },
  { id: 12, dimension: 'resiliency', text: 'I help my team recover and learn from setbacks.' },
  
  // Transparency
  { id: 13, dimension: 'transparency', text: 'I communicate openly about decisions, even when they might be unpopular.' },
  { id: 14, dimension: 'transparency', text: 'I share information that helps others understand the context of our work.' },
  { id: 15, dimension: 'transparency', text: 'I explain the "why" behind decisions and changes.' },
  
  // Inclusivity
  { id: 16, dimension: 'inclusivity', text: 'I ensure all team members have opportunities to contribute and be heard.' },
  { id: 17, dimension: 'inclusivity', text: 'I value diversity of thought and background on my team.' },
  { id: 18, dimension: 'inclusivity', text: 'I actively work to remove barriers that exclude certain individuals or groups.' },
];

// Group questions by dimension
const questionsByDimension: Record<HEARTIDimension, HEARTIQuestion[]> = {
  humility: questions.filter(q => q.dimension === 'humility'),
  empathy: questions.filter(q => q.dimension === 'empathy'),
  accountability: questions.filter(q => q.dimension === 'accountability'),
  resiliency: questions.filter(q => q.dimension === 'resiliency'),
  transparency: questions.filter(q => q.dimension === 'transparency'),
  inclusivity: questions.filter(q => q.dimension === 'inclusivity'),
};

interface AssessmentFormProps {
  onComplete: (assessment: HEARTIAssessment) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const dimensions: HEARTIDimension[] = [
    'humility', 
    'empathy', 
    'accountability', 
    'resiliency', 
    'transparency', 
    'inclusivity'
  ];
  const currentDimension = dimensions[currentDimensionIndex];
  const [answers, setAnswers] = useState<HEARTIAnswer[]>([]);

  const handleAnswerChange = (questionId: number, score: number) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId, score };
        return newAnswers;
      }
      return [...prev, { questionId, score }];
    });
  };

  const isCurrentSectionComplete = () => {
    const currentQuestions = questionsByDimension[currentDimension];
    return currentQuestions.every(q => 
      answers.some(a => a.questionId === q.id)
    );
  };

  const handleNext = () => {
    if (!isCurrentSectionComplete()) {
      toast({
        title: "Please answer all questions",
        description: "All questions must be answered before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentDimensionIndex < dimensions.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentDimensionIndex > 0) {
      setCurrentDimensionIndex(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    const dimensionScores = calculateDimensionScores(answers, questions);
    const overallScore = calculateOverallScore(dimensionScores);
    
    const assessment: HEARTIAssessment = {
      id: uuidv4(),
      date: new Date().toISOString(),
      answers,
      dimensionScores,
      overallScore
    };
    
    saveAssessment(assessment);
    onComplete(assessment);
    
    toast({
      title: "Assessment completed!",
      description: "Your HEARTI leadership assessment has been saved.",
    });
  };

  const dimensionTitleMap: Record<HEARTIDimension, string> = {
    humility: 'Humility',
    empathy: 'Empathy',
    accountability: 'Accountability',
    resiliency: 'Resiliency',
    transparency: 'Transparency',
    inclusivity: 'Inclusivity'
  };

  const dimensionDescriptionMap: Record<HEARTIDimension, string> = {
    humility: 'Recognizing one\'s limitations and being open to growth',
    empathy: 'Understanding and sharing the feelings of others',
    accountability: 'Taking responsibility for actions and commitments',
    resiliency: 'Recovering from setbacks and adapting to change',
    transparency: 'Being open, honest, and clear in communications',
    inclusivity: 'Creating environments where all feel welcomed and valued'
  };

  return (
    <Card className="w-full appear-animate shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {dimensionTitleMap[currentDimension]}
        </CardTitle>
        <CardDescription>
          {dimensionDescriptionMap[currentDimension]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {questionsByDimension[currentDimension].map((question) => (
            <div key={question.id} className="space-y-3">
              <div className="font-medium">{question.text}</div>
              <RadioGroup 
                onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                value={answers.find(a => a.questionId === question.id)?.score.toString() || ""}
              >
                <div className="flex justify-between max-w-md">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id={`q${question.id}-1`} />
                    <Label htmlFor={`q${question.id}-1`}>Nearly Never</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id={`q${question.id}-2`} />
                    <Label htmlFor={`q${question.id}-2`}>Rarely</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id={`q${question.id}-3`} />
                    <Label htmlFor={`q${question.id}-3`}>Sometimes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id={`q${question.id}-4`} />
                    <Label htmlFor={`q${question.id}-4`}>Frequently</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id={`q${question.id}-5`} />
                    <Label htmlFor={`q${question.id}-5`}>Almost Always</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentDimensionIndex === 0}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          {currentDimensionIndex + 1} of {dimensions.length}
        </div>
        <Button onClick={handleNext}>
          {currentDimensionIndex === dimensions.length - 1 ? 'Complete' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentForm;
