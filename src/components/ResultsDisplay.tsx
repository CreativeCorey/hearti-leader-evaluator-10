
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
import PremiumTeaser from '@/components/results/PremiumTeaser';
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
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const { checkingPayment, hasPaid } = useAssessmentPayment((updatedAssessment) => {
    console.log("Payment completed:", updatedAssessment);
    setShowPaymentGateway(false);
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

  const handleUpgrade = () => {
    setShowPaymentGateway(true);
  };

  // Show payment gateway when requested
  if (showPaymentGateway) {
    return <PaymentGateway 
      assessment={assessment} 
      onPaymentComplete={(updatedAssessment) => {
        console.log("Payment completed:", updatedAssessment);
        setShowPaymentGateway(false);
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
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-0 m-0">
          <OverviewTabContent assessment={assessment} />
        </TabsContent>

        <TabsContent value="dimensions" className="p-0 m-0">
          {hasPaid ? (
            <DimensionsTabContent assessment={assessment} />
          ) : (
            <PremiumTeaser 
              tabName="Detailed Dimensions Analysis"
              features={[
                "Detailed assessment of all 6 leadership skills",
                "Visual dimension breakdown and scoring",
                "Personalized insights for each dimension",
                "Track your progress over time"
              ]}
              onUpgrade={handleUpgrade}
              previewContent={<DimensionsTabContent assessment={assessment} />}
            />
          )}
        </TabsContent>

        <TabsContent value="dataViz" className="p-0 m-0">
          {hasPaid ? (
            <ComparisonTabContent assessment={assessment} assessments={allAssessments} />
          ) : (
            <PremiumTeaser 
              tabName="Data Visualization & Comparison"
              features={[
                "Compare your scores with industry benchmarks",
                "Visual radar charts and progress tracking", 
                "Historical assessment comparison",
                "Advanced analytics and insights"
              ]}
              onUpgrade={handleUpgrade}
              previewContent={<ComparisonTabContent assessment={assessment} assessments={allAssessments} />}
            />
          )}
        </TabsContent>

        <TabsContent value="report" className="p-0 m-0">
          {hasPaid ? (
            <ReportTabContent 
              assessment={assessment} 
              assessments={allAssessments} 
              reportRef={React.createRef()} 
              onExportPDF={async () => {}} 
              exportingPdf={false}
            />
          ) : (
            <PremiumTeaser 
              tabName="Professional Report"
              features={[
                "Comprehensive PDF report generation",
                "Professional formatting for sharing",
                "Export your results and share with your team",
                "Print-ready leadership assessment report"
              ]}
              onUpgrade={handleUpgrade}
            />
          )}
        </TabsContent>

        <TabsContent value="developSkills" className="p-0 m-0">
          {hasPaid ? (
            <DevelopmentTabContent 
              assessments={[assessment]} 
              topDevelopmentArea={Object.entries(assessment.dimensionScores)
                .sort(([, a], [, b]) => a - b)[0][0] as 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity'}
            />
          ) : (
            <PremiumTeaser 
              tabName="Skill Development Activities"
              features={[
                "Personalized development activities",
                "Targeted exercises for your growth areas",
                "Track and save your favorite activities",
                "Evidence-based leadership development"
              ]}
              onUpgrade={handleUpgrade}
            />
          )}
        </TabsContent>

        <TabsContent value="buildHabits" className="p-0 m-0">
          {hasPaid ? (
            <HabitTabContent 
              topDevelopmentArea={Object.entries(assessment.dimensionScores)
                .sort(([, a], [, b]) => a - b)[0][0] as 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity'} 
              onRefreshAssessments={onRefreshAssessments}
            />
          ) : (
            <PremiumTeaser 
              tabName="Habit Building Tools"
              features={[
                "Progress tracking and habit builder tools",
                "Daily leadership habit suggestions",
                "Streak tracking and goal setting",
                "Personalized habit recommendations"
              ]}
              onUpgrade={handleUpgrade}
            />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ResultsDisplay;
