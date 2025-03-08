
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { HEARTIAssessment, HEARTIDimension } from '@/types';
import { Hexagon, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import DemographicsSection from './DemographicsSection';
import ResultsTabContent from './ResultsTabContent';
import ResultsExportPDF from './ResultsExportPDF';

interface ResultsDisplayProps {
  assessment: HEARTIAssessment;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ assessment }) => {
  const { toast } = useToast();
  const [exportingPdf, setExportingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const formattedDate = format(new Date(assessment.date), 'MMMM d, yyyy');
  
  const getTopDevelopmentArea = (): HEARTIDimension => {
    const sortedDimensions = Object.entries(assessment.dimensionScores)
      .sort(([, a], [, b]) => a - b)
      .map(([dimension]) => dimension as HEARTIDimension);
    
    return sortedDimensions[0];
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExportingPdf(true);
    
    try {
      await ResultsExportPDF.exportPDF(reportRef, assessment, toast);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="appear-animate shadow-md border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Hexagon className="text-indigo-600" size={24} />
            HEARTI Assessment Results
          </CardTitle>
          <CardDescription>
            Completed on {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 overflow-x-auto grid grid-cols-2 md:grid-cols-6 w-full gap-1">
              <TabsTrigger value="overview" className="px-3 md:px-4">Overview</TabsTrigger>
              <TabsTrigger value="dimensions" className="px-3 md:px-4">Dimensions</TabsTrigger>
              <TabsTrigger value="comparison" className="px-3 md:px-4">Comparison</TabsTrigger>
              <TabsTrigger value="report" className="px-3 md:px-4">Report</TabsTrigger>
              <TabsTrigger value="habits" className="px-3 md:px-4">Habit Tracker</TabsTrigger>
              <TabsTrigger value="development" className="px-3 md:px-4">Skill Development</TabsTrigger>
            </TabsList>
            
            <ResultsTabContent 
              assessment={assessment} 
              reportRef={reportRef} 
              onExportPDF={handleExportPDF}
              exportingPdf={exportingPdf}
              topDevelopmentArea={getTopDevelopmentArea()}
            />
          </Tabs>

          {assessment.demographics && Object.keys(assessment.demographics).length > 0 && (
            <>
              <Separator className="my-6" />
              <DemographicsSection demographics={assessment.demographics} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
