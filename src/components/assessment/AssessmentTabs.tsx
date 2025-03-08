
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIAssessment } from '@/types';
import AssessmentForm from '@/components/AssessmentForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import HistoricalResults from '@/components/HistoricalResults';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AssessmentTabsProps {
  activeTab: 'take' | 'results';
  setActiveTab: (tab: 'take' | 'results') => void;
  userAssessments: HEARTIAssessment[];
  latestAssessment: HEARTIAssessment | null;
  onComplete: (assessment: HEARTIAssessment) => void;
  testingSheets: boolean;
  sendLatestToSheets: () => void;
}

const AssessmentTabs: React.FC<AssessmentTabsProps> = ({
  activeTab,
  setActiveTab,
  userAssessments,
  latestAssessment,
  onComplete,
  testingSheets,
  sendLatestToSheets
}) => {
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'take' | 'results')}>
      <div className="mobile-tabs-container">
        <TabsList className={`mb-8 w-full ${isMobile ? 'mobile-tabs' : ''}`}>
          <TabsTrigger value="take" className={`flex-1 ${isMobile ? 'mobile-tab' : ''}`}>Take Assessment</TabsTrigger>
          <TabsTrigger value="results" className={`flex-1 ${isMobile ? 'mobile-tab' : ''}`} disabled={userAssessments.length === 0}>View Results</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="take">
        <AssessmentForm onComplete={onComplete} />
      </TabsContent>
      
      <TabsContent value="results">
        <div className="space-y-8">
          {latestAssessment && (
            <div>
              <h2 className="text-xl font-bold mb-4">Latest Assessment Results</h2>
              <ResultsDisplay assessment={latestAssessment} />
              
              <div className="mt-6 flex gap-3">
                <Button 
                  onClick={sendLatestToSheets}
                  disabled={testingSheets}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {testingSheets && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send to Google Sheets
                </Button>
              </div>
            </div>
          )}
          
          {userAssessments.length > 1 && (
            <div>
              <Separator className="my-8" />
              <h2 className="text-xl font-bold mb-4">Assessment History</h2>
              <HistoricalResults 
                assessments={userAssessments} 
                onSelect={(assessment) => latestAssessment = assessment} 
              />
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AssessmentTabs;
