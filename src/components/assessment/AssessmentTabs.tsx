import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentTab, HEARTIAssessment } from '@/types';
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
  
  const { checkingPayment, hasPaid } = useAssessmentPayment((updatedAssessment) => {
    console.log("Payment completed:", updatedAssessment);
    setShowPaymentGateway(false);
    onComplete(updatedAssessment);
  });

  // Check for empty state when component mounts
  useEffect(() => {
    if (!latestAssessment && userAssessments.length === 0) {
      setShowEmptyState(true);
    } else {
      setShowEmptyState(false);
    }
  }, [latestAssessment, userAssessments]);

  // Check for saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('assessmentProgress');
    if (savedProgress && !latestAssessment) {
      setIsAssessmentInProgress(true);
    }
  }, [latestAssessment]);

  // Redirect to overview tab if user has assessments but is on take tab
  useEffect(() => {
    if (latestAssessment && activeTab === 'take') {
      setActiveTab('overview');
    }
  }, [latestAssessment, activeTab, setActiveTab]);

  const handleTakeAssessment = () => {
    setShowAssessmentForm(true);
    setShowEmptyState(false);
    setActiveTab('take');
  };

  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    console.log("handleAssessmentComplete called with assessment:", assessment);
    setCompletedAssessment(assessment);
    setShowAssessmentForm(false);
    setIsAssessmentInProgress(false);
    
    // Clear any saved progress
    localStorage.removeItem('assessmentProgress');
    
    // If user hasn't paid, show payment gateway
    if (!hasPaid) {
      console.log("User hasn't paid, showing payment gateway");
      setShowPaymentGateway(true);
    } else {
      console.log("User has paid, calling onComplete");
      onComplete(assessment);
      setActiveTab('overview');
    }
  };

  // Show payment gateway if requested
  if (showPaymentGateway) {
    return <PaymentGateway 
      assessment={completedAssessment || latestAssessment!} 
      onPaymentComplete={(updatedAssessment) => {
        console.log("Payment completed:", updatedAssessment);
        setShowPaymentGateway(false);
        onComplete(updatedAssessment);
        setActiveTab('overview');
      }} 
    />;
  }

  // Show assessment form when taking assessment
  if (showAssessmentForm || activeTab === 'take') {
    return (
      <AssessmentForm
        onComplete={handleAssessmentComplete}
      />
    );
  }

  // Show empty state for first-time users
  if (showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Take Your First HEARTI Assessment</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Discover your leadership strengths and areas for growth with our comprehensive HEARTI assessment.
        </p>
        <button
          onClick={handleTakeAssessment}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  // Show loading state if needed
  if (viewTransitioning) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <TabsTrigger value="dimensions" disabled={!hasPaid}>{t('tabs.dimensions')}</TabsTrigger>
            <TabsTrigger value="dataViz" disabled={!hasPaid}>{t('tabs.dataViz.desktop')}</TabsTrigger>
            <TabsTrigger value="report" disabled={!hasPaid}>{t('tabs.report')}</TabsTrigger>
            <TabsTrigger value="developSkills" disabled={!hasPaid}>{t('tabs.developSkills')}</TabsTrigger>
            <TabsTrigger value="buildHabits" disabled={!hasPaid}>{t('tabs.buildHabits')}</TabsTrigger>
          </TabsList>
          
          {/* Results content - only show if paid or on overview tab */}
          <div className="mt-4">
            {hasPaid || activeTab === 'overview' ? (
              <ResultsDisplay
                assessment={latestAssessment}
                allAssessments={userAssessments}
                onRefreshAssessments={() => {}}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold mb-4">Premium Content</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Unlock all assessment features including detailed analysis, coaching recommendations, and habit tracking.
                </p>
                <PaymentGateway 
                  assessment={latestAssessment}
                  onPaymentComplete={(assessment) => {
                    onComplete(assessment);
                    setActiveTab('overview');
                  }}
                />
              </div>
            )}
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default AssessmentTabs;