
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentTab, HEARTIAssessment, ResultsDisplayProps } from '@/types';
import ResultsDisplay from '@/components/results/ResultsDisplay';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from '@/components/AssessmentForm';

interface AssessmentTabsProps {
  activeTab: AssessmentTab;
  setActiveTab: (tab: AssessmentTab) => void;
  userAssessments: HEARTIAssessment[];
  latestAssessment: HEARTIAssessment | null;
  onComplete: (assessment: HEARTIAssessment) => void;
  testingSheets?: boolean;
  sendLatestToSheets?: () => Promise<void>;
  viewTransitioning?: boolean;
}

const AssessmentTabs: React.FC<AssessmentTabsProps> = ({
  activeTab,
  setActiveTab,
  userAssessments,
  latestAssessment,
  onComplete,
  testingSheets,
  sendLatestToSheets,
  viewTransitioning
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [isAssessmentInProgress, setIsAssessmentInProgress] = useState(false);
  
  // Check for saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('assessment_progress');
    if (savedProgress) {
      // If there's saved progress, we consider assessment in progress
      setIsAssessmentInProgress(true);
    }
  }, []);
  
  // Check if assessments are available after a short delay
  // This helps avoid the flash of "No assessments available" during initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmptyState(!latestAssessment && userAssessments.length === 0 && !isAssessmentInProgress);
    }, 500); // Reduced from 1000ms to 500ms for faster loading
    
    return () => clearTimeout(timer);
  }, [latestAssessment, userAssessments, isAssessmentInProgress]);
  
  // Redirect to take assessment tab if no assessments available
  useEffect(() => {
    if (showEmptyState && activeTab !== 'take') {
      setActiveTab('take');
      toast({
        title: "No assessments found",
        description: "Please take an assessment to view your results.",
      });
    }
  }, [showEmptyState, activeTab, setActiveTab, toast]);

  // Handle the take assessment button click
  const handleTakeAssessment = () => {
    console.log("Take assessment button clicked");
    setShowAssessmentForm(true);
    setIsAssessmentInProgress(true);
    // Update the URL without full page reload
    window.history.pushState(null, '', '/?tab=take');
    setActiveTab('take');
  };
  
  // Handle assessment completion
  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    setIsAssessmentInProgress(false); // Assessment is no longer in progress
    onComplete(assessment);
    setShowAssessmentForm(false);
    setActiveTab('overview'); // Switch to overview after completion
  };
  
  // If showing the assessment form, render it
  if (showAssessmentForm || activeTab === 'take') {
    return (
      <div className="max-w-3xl mx-auto my-4">
        <AssessmentForm onComplete={handleAssessmentComplete} />
      </div>
    );
  }
  
  // If no assessments are available yet, show a prompt to take an assessment
  if (showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Meet Your HEARTI™ Coach</h2>
        <p className="mb-6 text-muted-foreground max-w-md">
          Start your leadership journey by completing the assessment to see your results.
        </p>
        <button 
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={handleTakeAssessment}
        >
          Take Assessment
        </button>
      </div>
    );
  }
  
  if (!latestAssessment && userAssessments.length === 0) {
    // Show a more lightweight loading state
    return (
      <div className="flex justify-center p-4">
        <div className="animate-pulse flex space-x-2 w-full max-w-md">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Only show tabs if we have assessments */}
      {latestAssessment && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssessmentTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Summary</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
            <TabsTrigger value="dataViz">HEARTI Spectra</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="developSkills">HEARTI Coach</TabsTrigger>
            <TabsTrigger value="buildHabits">Build Habits</TabsTrigger>
          </TabsList>
          
          {/* Results content - pass the activeTab to control which content shows */}
          <div className="mt-4">
            <ResultsDisplay
              assessment={latestAssessment}
              assessments={userAssessments}
            />
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default AssessmentTabs;
