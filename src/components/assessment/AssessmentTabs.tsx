
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentTab, HEARTIAssessment, ResultsDisplayProps } from '@/types';
import ResultsDisplay from '@/components/results/ResultsDisplay';
import PaymentGateway from '@/components/PaymentGateway';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from '@/components/AssessmentForm';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';
import { useLanguage } from '@/contexts/language/LanguageContext';

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
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [isAssessmentInProgress, setIsAssessmentInProgress] = useState(false);
  const [completedAssessment, setCompletedAssessment] = useState<HEARTIAssessment | null>(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  
  // Payment verification hook
  const { hasPaid, checkingPayment } = useAssessmentPayment((assessment) => {
    // When payment is complete, show results
    setShowPaymentGateway(false);
    setActiveTab('overview');
  });
  
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
    console.log("handleAssessmentComplete called with assessment:", assessment);
    console.log("Payment status - hasPaid:", hasPaid, "checkingPayment:", checkingPayment);
    
    setIsAssessmentInProgress(false); // Assessment is no longer in progress
    setCompletedAssessment(assessment);
    setShowAssessmentForm(false);
    
    // Check if user has paid - if not, show payment gateway
    if (!hasPaid && !checkingPayment) {
      console.log("User has not paid, showing payment gateway");
      setShowPaymentGateway(true);
      setActiveTab('overview'); // Set to overview but payment will show
    } else if (hasPaid) {
      console.log("User has already paid, proceeding to results");
      // User has already paid, proceed to results
      onComplete(assessment);
      setActiveTab('overview');
    } else {
      console.log("Payment status unclear, defaulting to payment gateway");
      // Default to payment gateway if payment status is unclear
      setShowPaymentGateway(true);
      setActiveTab('overview');
    }
  };
  
  
  // If showing the payment gateway after assessment completion
  if (showPaymentGateway && completedAssessment) {
    return (
      <div className="max-w-md mx-auto my-8">
        <PaymentGateway 
          assessment={completedAssessment}
          onPaymentComplete={(assessment) => {
            setShowPaymentGateway(false);
            onComplete(assessment);
            setActiveTab('overview');
          }}
        />
      </div>
    );
  }
  
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
            <TabsTrigger value="overview">{t('tabs.summary')}</TabsTrigger>
            <TabsTrigger value="dimensions">{t('tabs.dimensions')}</TabsTrigger>
            <TabsTrigger value="dataViz">{t('tabs.dataViz.desktop')}</TabsTrigger>
            <TabsTrigger value="report">{t('tabs.report')}</TabsTrigger>
            <TabsTrigger value="developSkills">{t('tabs.developSkills')}</TabsTrigger>
            <TabsTrigger value="buildHabits">{t('tabs.buildHabits')}</TabsTrigger>
          </TabsList>
          
          {/* Results content */}
          <div className="mt-4">
            <ResultsDisplay
              assessment={latestAssessment}
              allAssessments={userAssessments}
              onRefreshAssessments={() => {}}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default AssessmentTabs;
