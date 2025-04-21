
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLanguage } from '@/contexts/language/LanguageContext';
import { useIsMobile } from "@/hooks/use-mobile";
import { HEARTIAssessment, AssessmentTab } from '@/types';
import { useViewTransitions } from '@/hooks/useViewTransitions';
import OverviewTabContent from '@/components/results/tabs/OverviewTabContent';
import DimensionsTabContent from '@/components/results/tabs/DimensionsTabContent';
import ComparisonTabContent from '@/components/results/tabs/ComparisonTabContent';
import ReportTabContent from '@/components/results/tabs/ReportTabContent';
import DevelopmentTabContent from '@/components/results/tabs/DevelopmentTabContent';
import HabitTabContent from '@/components/results/tabs/HabitTabContent';
import PaymentGateway from '@/components/PaymentGateway';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';

interface ResultsDisplayProps {
  assessment: HEARTIAssessment;
  allAssessments: HEARTIAssessment[];
  onRefreshAssessments?: () => void;
  loading?: boolean;
  className?: string;
  activeTab?: AssessmentTab;
  onTabChange?: (tab: AssessmentTab) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  assessment,
  allAssessments,
  onRefreshAssessments,
  loading = false,
  className = '',
  activeTab = 'overview',
  onTabChange
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { viewTransitioning } = useViewTransitions();
  const [isClient, setIsClient] = useState(false);
  const { checkingPayment, hasPaid } = useAssessmentPayment((updatedAssessment) => {
    console.log("Payment completed:", updatedAssessment);
    if (onRefreshAssessments) {
      onRefreshAssessments();
    }
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  if (loading || viewTransitioning) {
    return <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  if (checkingPayment) {
    return <div className="min-h-[400px] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="ml-2">Checking payment status...</span>
    </div>;
  }

  // Show only Overview tab for unpaid users
  if (!hasPaid && activeTab !== 'overview') {
    return <PaymentGateway 
      assessment={assessment} 
      onPaymentComplete={(updatedAssessment) => {
        console.log("Payment completed:", updatedAssessment);
        if (onRefreshAssessments) {
          onRefreshAssessments();
        }
      }} 
    />;
  }

  return (
    <Card className={`overflow-hidden rounded-lg border ${className}`}>
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={(value) => onTabChange?.(value as AssessmentTab)}
        className="w-full"
      >
        <div className="px-1 pt-1 border-b overflow-x-auto scrollbar-hide">
          <TabsList className="grid grid-flow-col auto-cols-max gap-2 justify-start p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm capitalize px-2 sm:px-3">
              {t('tabs.summary')}
            </TabsTrigger>
            {hasPaid && (
              <>
                <TabsTrigger value="dimensions" className="text-xs sm:text-sm capitalize px-2 sm:px-3">
                  {t('tabs.dimensions')}
                </TabsTrigger>
                <TabsTrigger value="dataViz" className="text-xs sm:text-sm capitalize px-2 sm:px-3">
                  {isMobile ? t('tabs.dataViz.mobile') : t('tabs.dataViz.desktop')}
                </TabsTrigger>
                <TabsTrigger value="report" className="text-xs sm:text-sm capitalize px-2 sm:px-3">
                  {t('tabs.report')}
                </TabsTrigger>
                <TabsTrigger value="developSkills" className="text-xs sm:text-sm capitalize px-2 sm:px-3">
                  {t('tabs.developSkills')}
                </TabsTrigger>
                <TabsTrigger value="buildHabits" className="text-xs sm:text-sm capitalize px-2 sm:px-3">
                  {t('tabs.buildHabits')}
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-0 m-0">
          <OverviewTabContent assessment={assessment} />
        </TabsContent>

        {hasPaid && (
          <>
            <TabsContent value="dimensions" className="p-0 m-0">
              <DimensionsTabContent assessment={assessment} />
            </TabsContent>

            <TabsContent value="dataViz" className="p-0 m-0">
              <ComparisonTabContent assessment={assessment} assessments={allAssessments} />
            </TabsContent>

            <TabsContent value="report" className="p-0 m-0">
              <ReportTabContent 
                assessment={assessment} 
                assessments={allAssessments} 
                reportRef={React.createRef()} 
                onExportPDF={async () => {}} 
                exportingPdf={false}
              />
            </TabsContent>

            <TabsContent value="developSkills" className="p-0 m-0">
              <DevelopmentTabContent 
                assessments={[assessment]} 
                topDevelopmentArea={Object.entries(assessment.dimensionScores)
                  .sort(([, a], [, b]) => a - b)[0][0] as 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity'}
              />
            </TabsContent>

            <TabsContent value="buildHabits" className="p-0 m-0">
              <HabitTabContent 
                topDevelopmentArea={Object.entries(assessment.dimensionScores)
                  .sort(([, a], [, b]) => a - b)[0][0] as 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity'} 
                onRefreshAssessments={onRefreshAssessments}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </Card>
  );
};

export default ResultsDisplay;
