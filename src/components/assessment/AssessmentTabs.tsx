
import React, { memo, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIAssessment } from '@/types';
import AssessmentForm from '@/components/AssessmentForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language/LanguageContext';

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
  viewTransitioning = false
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [forcedRender, setForcedRender] = useState(0);
  const [tabWasManuallySelected, setTabWasManuallySelected] = useState(false);

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

  // Auto-switch to results tab if user has assessments but only on initial load
  useEffect(() => {
    if (!tabWasManuallySelected && userAssessments.length > 0 && activeTab === 'take') {
      console.log("Auto-switching to results tab due to existing assessment data");
      setActiveTab('results');
    }
  }, [userAssessments, activeTab, setActiveTab, tabWasManuallySelected]);

  // Handle form completion
  const handleAssessmentComplete = (assessment: HEARTIAssessment) => {
    onComplete(assessment);
    // Automatically switch to results tab after completion
    setActiveTab('results');
    toast({
      title: t("assessment.completed"),
      description: t("assessment.submitSuccess"),
    });
  };

  // Fix for tab switching issue
  const handleTabChange = (value: string) => {
    console.log("Tab change requested to:", value);
    if (value === 'take' || value === 'results') {
      setTabWasManuallySelected(true);
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
          <TabsTrigger value="take" className="px-4 py-2">{t('assessment.takeAssessment')}</TabsTrigger>
          <TabsTrigger value="results" className="px-4 py-2" disabled={userAssessments.length === 0}>{t('assessment.viewResults')}</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="take" className="mt-0">
        <AssessmentForm onComplete={handleAssessmentComplete} />
      </TabsContent>
      
      <TabsContent value="results" className="mt-0">
        <div className="space-y-4 sm:space-y-8">
          {latestAssessment && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-orange">{t('assessment.latestResults')}</h2>
              <ResultsDisplay 
                assessment={latestAssessment} 
                assessments={userAssessments}
              />
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
});

export default AssessmentTabs;
