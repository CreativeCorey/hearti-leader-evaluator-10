import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { v4 as uuidv4 } from 'uuid';
import { 
  HEARTIQuestion, 
  HEARTIAnswer, 
  HEARTIAssessment,
  HEARTIDimension,
  Demographics
} from '../types';
import { calculateDimensionScores, calculateOverallScore } from '../utils/calculations';
import { saveAssessment, ensureUserExists, getOrCreateAnonymousId } from '../utils/localStorage';
import { ensureUserProfileExists } from '../utils/supabaseHelpers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DemographicForm from './DemographicForm';

const questions: HEARTIQuestion[] = [
  // Humility
  { id: 1, dimension: 'humility', text: 'I acknowledge when I don\'t know the answer.' },
  { id: 2, dimension: 'humility', text: 'I ask for feedback.' },
  { id: 3, dimension: 'humility', text: 'If people express criticism, I implement what I learn.' },
  { id: 4, dimension: 'humility', text: 'I publicly give credit and publicly amplify the success of others.' },
  { id: 5, dimension: 'humility', text: 'Partnering with others is foundational to my success.' },
  { id: 6, dimension: 'humility', text: 'I get frustrated when I don\'t get recognition.', reverseScored: true },
  { id: 7, dimension: 'humility', text: 'I\'ve been told I\'m a micromanager.', reverseScored: true },
  { id: 8, dimension: 'humility', text: 'I let my team figure out how to get work done.' },
  { id: 9, dimension: 'humility', text: 'I listen more than I talk.' },
  
  // Empathy
  { id: 10, dimension: 'empathy', text: 'I seek to understand situations from another person\'s point of view by asking questions and being curious.' },
  { id: 11, dimension: 'empathy', text: 'I reach out and express my support when I see that others are struggling.' },
  { id: 13, dimension: 'empathy', text: 'When making an important decision, I deliberately consult with those who think differently than me.' },
  { id: 14, dimension: 'empathy', text: 'I can recognize when others struggle without asking them.' },
  { id: 15, dimension: 'empathy', text: 'I learn from the different views and opinions of others.' },
  { id: 16, dimension: 'empathy', text: 'I strive to keep everyone happy, sometimes to a fault.', reverseScored: true },
  { id: 17, dimension: 'empathy', text: 'I understand the best way to communicate feedback to each team member.' },
  { id: 18, dimension: 'empathy', text: 'I prioritize delivering results even when there is a cost to the well-being of my team.', reverseScored: true },
  { id: 19, dimension: 'empathy', text: 'When I am talking with someone, I often think about what I am going to say next.', reverseScored: true },
  
  // Accountability
  { id: 20, dimension: 'accountability', text: 'I hold others accountable for their behaviors to create a workplace of belonging.' },
  { id: 21, dimension: 'accountability', text: 'I take ownership of my decisions and the consequences of mistakes.' },
  { id: 22, dimension: 'accountability', text: 'My colleagues trust me to get the job done.' },
  { id: 23, dimension: 'accountability', text: 'I give individuals on my team the authority to make critical decisions.' },
  { id: 24, dimension: 'accountability', text: 'I communicate when I can\'t meet a deadline.' },
  { id: 25, dimension: 'accountability', text: 'When making decisions, I prefer to keep my options open.', reverseScored: true },
  { id: 26, dimension: 'accountability', text: 'I hold others accountable for completing their assignments accurately and on time.' },
  { id: 27, dimension: 'accountability', text: 'I hold others accountable even if it makes me feel uncomfortable.' },
  { id: 28, dimension: 'accountability', text: 'My team tells me when they are behind on goals.' },
  
  // Resiliency
  { id: 29, dimension: 'resiliency', text: 'Unexpected obstacles present opportunities.' },
  { id: 30, dimension: 'resiliency', text: 'I have a hard time giving up on a goal.' },
  { id: 31, dimension: 'resiliency', text: 'When I fail, I am able to adapt and try an alternative approach.' },
  { id: 32, dimension: 'resiliency', text: 'I struggle to get over mistakes I made.', reverseScored: true },
  { id: 33, dimension: 'resiliency', text: 'I gain wisdom from my failures.' },
  { id: 34, dimension: 'resiliency', text: 'I achieve my goals.' },
  { id: 35, dimension: 'resiliency', text: 'I have a positive outlook on life.' },
  { id: 36, dimension: 'resiliency', text: 'I reach out to others for support when I am under stress.' },
  { id: 37, dimension: 'resiliency', text: 'I practice self-care to avoid burn out.' },
  { id: 38, dimension: 'resiliency', text: 'My team feels burned out.', reverseScored: true },
  
  // Transparency
  { id: 39, dimension: 'transparency', text: 'I share information that allows my team to do their jobs more effectively.' },
  { id: 40, dimension: 'transparency', text: 'I avoid difficult conversations.', reverseScored: true },
  { id: 41, dimension: 'transparency', text: 'I am comfortable being vulnerable about my shortcomings and challenges.' },
  { id: 42, dimension: 'transparency', text: 'I explain my decisions so others understand why.' },
  { id: 43, dimension: 'transparency', text: 'I believe that information should be shared only on a need to know basis.', reverseScored: true },
  { id: 44, dimension: 'transparency', text: 'I ensure my communications are relevant and appropriate to each audience.' },
  { id: 45, dimension: 'transparency', text: 'I am willing to take a public stand on controversial issues.' },
  { id: 46, dimension: 'transparency', text: 'I share my vision and purpose so others can better understand what motivates me.' },
  { id: 47, dimension: 'transparency', text: 'I prioritize my time for important conversations.' },
  { id: 48, dimension: 'transparency', text: 'When the news is bad, I don\'t try to gloss over the truth.' },
  { id: 49, dimension: 'transparency', text: 'People tell me I am easy to talk to.' },
  
  // Inclusivity
  { id: 50, dimension: 'inclusivity', text: 'I hire, refer, and recommend BIPOC candidates.' },
  { id: 51, dimension: 'inclusivity', text: 'I seek out and participate in training that mentions microaggressions, anti-racism, or white privilege.' },
  { id: 52, dimension: 'inclusivity', text: 'I provide corrective feedback to people who behave in a sexist, racist, or homophobic manner.' },
  { id: 53, dimension: 'inclusivity', text: 'There are people from different generations who are my close confidants at work.' },
  { id: 54, dimension: 'inclusivity', text: 'I find it hard to recognize or understand the issues around DEI.', reverseScored: true },
  { id: 55, dimension: 'inclusivity', text: 'Diversity and inclusion are a distraction from pressing business problems.', reverseScored: true },
  { id: 56, dimension: 'inclusivity', text: 'I initiate conversations about challenging diversity and inclusion topics.' },
  { id: 57, dimension: 'inclusivity', text: 'I actively sponsor people from underrepresented communities.' },
  { id: 58, dimension: 'inclusivity', text: 'I ask BIPOC and LGBTQ+ colleagues about their experience in our work environment.' },
  { id: 59, dimension: 'inclusivity', text: 'I collaborate with diverse talent to ensure our workplace programs and policies are inclusive.' },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface AssessmentFormProps {
  onComplete: (assessment: HEARTIAssessment) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<HEARTIQuestion[]>([]);
  const [answers, setAnswers] = useState<HEARTIAnswer[]>([]);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [tempAssessment, setTempAssessment] = useState<HEARTIAssessment | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string, organizationId?: string } | null>(null);
  const [transition, setTransition] = useState(false);
  
  const totalQuestions = questions.length;
  
  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
    
    // Initialize user
    const initUser = async () => {
      console.log("Initializing user, checking if exists...");
      try {
        const user = await ensureUserExists();
        setCurrentUser({
          id: user.id,
          organizationId: user.organizationId
        });
      } catch (error) {
        console.error("Failed to get user:", error);
        toast({
          title: "Error",
          description: "Failed to initialize user. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    initUser();
  }, []);
  
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerChange = (score: number) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === currentQuestion.id);
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = { questionId: currentQuestion.id, score };
        return newAnswers;
      }
      return [...prev, { questionId: currentQuestion.id, score }];
    });
  };

  const getCurrentAnswer = (): number => {
    if (!currentQuestion) return 3; // Default to middle value
    
    const existingAnswer = answers.find(a => a.questionId === currentQuestion.id);
    return existingAnswer ? existingAnswer.score : 3;
  };

  const handleNext = () => {
    // Ensure current question is answered
    if (!answers.some(a => a.questionId === currentQuestion?.id)) {
      toast({
        title: "Please answer the question",
        description: "Please select a value on the slider to continue.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setTransition(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setTransition(false);
      }, 150);
    } else {
      completeAssessmentQuestions();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setTransition(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev - 1);
        setTransition(false);
      }, 150);
    }
  };

  const completeAssessmentQuestions = () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "User not initialized. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }
    
    const finalAnswers = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question?.reverseScored) {
        return { ...answer, score: 6 - answer.score };
      }
      return answer;
    });

    const dimensionScores = calculateDimensionScores(finalAnswers, questions);
    const overallScore = calculateOverallScore(dimensionScores);
    
    const assessment: HEARTIAssessment = {
      id: uuidv4(),
      userId: currentUser.id,
      organizationId: currentUser.organizationId,
      date: new Date().toISOString(),
      answers: finalAnswers,
      dimensionScores,
      overallScore
    };
    
    setTempAssessment(assessment);
    setAssessmentComplete(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemographicsComplete = async (demographics: Demographics) => {
    if (!tempAssessment) return;
    
    const finalAssessment: HEARTIAssessment = {
      ...tempAssessment,
      demographics
    };
    
    try {
      await saveAssessment(finalAssessment);
      onComplete(finalAssessment);
      
      toast({
        title: "Assessment completed!",
        description: "Your HEARTI leadership assessment has been saved with demographics.",
      });
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSkipDemographics = async () => {
    if (!tempAssessment) return;
    
    try {
      await saveAssessment(tempAssessment);
      onComplete(tempAssessment);
      
      toast({
        title: "Assessment completed!",
        description: "Your HEARTI leadership assessment has been saved.",
      });
    } catch (error) {
      console.error("Failed to save assessment:", error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const DEBUG = import.meta.env.DEV;

  if (shuffledQuestions.length === 0 || !currentQuestion) {
    return <div className="flex justify-center p-6">Loading assessment questions...</div>;
  }

  if (assessmentComplete) {
    return (
      <DemographicForm 
        onComplete={handleDemographicsComplete} 
        onSkip={handleSkipDemographics} 
      />
    );
  }

  const currentScore = getCurrentAnswer();
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

  const scoreLabels = [
    { value: 1, label: "Nearly Never" },
    { value: 2, label: "Rarely" },
    { value: 3, label: "Sometimes" },
    { value: 4, label: "Frequently" },
    { value: 5, label: "Almost Always" },
  ];

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm">
      <CardHeader className="relative pb-0">
        <div className="h-1 w-full bg-orange/20 absolute top-0 left-0 right-0">
          <div 
            className="h-full bg-purple transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <CardTitle className="text-2xl">
          HEARTI Leadership Assessment
        </CardTitle>
        <CardDescription>
          Answer each question based on how frequently you exhibit the described behavior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 py-4">
          <div className="text-center mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
          
          <div className={`bg-muted/30 p-6 rounded-lg transition-opacity duration-150 ${transition ? 'opacity-0' : 'opacity-100'}`}>
            <h3 className="text-xl font-medium mb-6 text-center">{currentQuestion.text}</h3>
            
            <div className="mt-8 space-y-8">
              <div className="px-4">
                <Slider
                  value={[currentScore]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={value => handleAnswerChange(value[0])}
                  className="mb-6"
                />
                
                <div className="flex justify-between text-sm text-muted-foreground pt-2">
                  {scoreLabels.map(({ value, label }) => (
                    <button
                      key={value}
                      className={`text-center px-1 py-2 rounded hover:bg-primary/5 transition-colors ${
                        currentScore === value ? 'text-primary font-medium bg-primary/10' : ''
                      }`}
                      onClick={() => handleAnswerChange(value)}
                      aria-label={`Select ${label}`}
                    >
                      {isMobile ? value : label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-center mt-6">
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
                  <span className="font-medium">Selected:</span> {getScoreLabel(currentScore)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        
        <div className="text-sm text-muted-foreground font-medium">
          {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        
        <Button 
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Complete' : 'Next'} 
          {currentQuestionIndex !== totalQuestions - 1 && <ArrowRight className="h-4 w-4" />}
        </Button>
      </CardFooter>
      
      {DEBUG && (
        <div className="mt-4 p-4 border border-red-300 rounded bg-red-50">
          <h3 className="text-red-700 font-medium">Debug Tools</h3>
          <p className="text-sm text-red-600 mb-2">Only visible in development mode</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={async () => {
                const anonId = localStorage.getItem('hearti-anonymous-user-id');
                console.log("Current anonymous ID:", anonId);
                
                if (anonId) {
                  const success = await ensureUserProfileExists(anonId);
                  console.log("Profile creation result:", success);
                  toast({
                    title: success ? "Profile Created" : "Profile Creation Failed",
                    description: `Attempted to create profile for ${anonId}`,
                    variant: success ? "default" : "destructive"
                  });
                }
              }}
            >
              Debug: Create Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('hearti-anonymous-user-id');
                toast({
                  title: "Anonymous ID Cleared",
                  description: "You'll get a new anonymous ID on refresh",
                });
              }}
            >
              Clear Anonymous ID
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AssessmentForm;
