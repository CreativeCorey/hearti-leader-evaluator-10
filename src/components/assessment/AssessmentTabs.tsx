
import React, { memo, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIAssessment } from '@/types';
import AssessmentForm from '@/components/AssessmentForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface AssessmentTabsProps {
  activeTab: 'take' | 'results';
  setActiveTab: (tab: 'take' | 'results') => void;
  userAssessments: HEARTIAssessment[];
  latestAssessment: HEARTIAssessment | null;
  onComplete: (assessment: HEARTIAssessment) => void;
  testingSheets: boolean;
  sendLatestToSheets: () => Promise<void>;
  viewTransitioning?: boolean;
}

const AssessmentTabs: React.FC<AssessmentTabsProps> = memo(({
  activeTab,
  setActiveTab,
  userAssessments,
  latestAssessment,
  onComplete,
  testingSheets,
  sendLatestToSheets,
  viewTransitioning = false
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [forcedRender, setForcedRender] = useState(0);

  // Log the active tab for debugging
  useEffect(() => {
    console.log("AssessmentTabs active tab:", activeTab);
    console.log("User assessments count:", userAssessments.length);
  }, [activeTab, userAssessments.length]);

  // Fix for tab switching - force component to re-render when tab changes
  useEffect(() => {
    setForcedRender(prev => prev + 1);
  }, [activeTab]);

  // Handle tab change when orientation changes
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on orientation change
      window.dispatchEvent(new Event('resize'));
    };
    
    window.addEventListener('orientationchange', handleResize);
    return () => window.removeEventListener('orientationchange', handleResize);
  }, []);

  // Handle form completion
  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    onComplete(assessment);
    // Automatically switch to results tab after completion
    setActiveTab('results');
    toast({
      title: "Assessment Completed",
      description: "Your assessment has been submitted successfully.",
    });
  };

  // Fix for tab switching issue
  const handleTabChange = (value: string) => {
    console.log("Tab change requested to:", value);
    if (value === 'take' || value === 'results') {
      setActiveTab(value);
      console.log("Tab changed to:", value);
    }
  };

  return (
    <Tabs 
      key={`tabs-${forcedRender}`} 
      value={activeTab} 
      onValueChange={handleTabChange} 
      className="w-full"
    >
      <div className={`w-full overflow-hidden mb-4 ${viewTransitioning ? 'opacity-75 transition-opacity' : ''}`}>
        <TabsList className="w-full grid grid-cols-2 gap-1">
          <TabsTrigger value="take" className="px-4 py-2">Take Assessment</TabsTrigger>
          <TabsTrigger value="results" className="px-4 py-2" disabled={userAssessments.length === 0}>View Results</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="take" className="mt-0">
        <AssessmentForm onComplete={handleAssessmentComplete} />
      </TabsContent>
      
      <TabsContent value="results" className="mt-0">
        <div className="space-y-4 sm:space-y-8">
          {latestAssessment && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-orange">Latest Assessment Results</h2>
              <ResultsDisplay 
                assessment={latestAssessment} 
                assessments={userAssessments}
              />
              
              <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
                <Button 
                  onClick={sendLatestToSheets}
                  disabled={testingSheets}
                  variant="outline"
                  className="flex items-center gap-1.5 sm:gap-2 border-green text-green hover:bg-green/10 text-xs sm:text-sm py-1.5 sm:py-2 h-auto"
                >
                  {testingSheets && <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                  Send to Google Sheets
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
});

export default AssessmentTabs;
