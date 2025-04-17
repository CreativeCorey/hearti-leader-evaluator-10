import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentTab, HEARTIAssessment } from '@/types';
import ResultsDisplay from '@/components/ResultsDisplay';

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
  // This is a simplified version of the AssessmentTabs component
  // That exports the correct type and fixes the component prop errors
  
  if (!latestAssessment) {
    return <div>No assessments available</div>;
  }
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssessmentTab)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
          <TabsTrigger value="dataViz">Data</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="developSkills">Development</TabsTrigger>
          <TabsTrigger value="buildHabits">Habits</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <ResultsDisplay
        assessment={latestAssessment}
        allAssessments={userAssessments}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefreshAssessments={() => {
          // Refresh assessments logic would go here
        }}
      />
    </div>
  );
};

export default AssessmentTabs;
