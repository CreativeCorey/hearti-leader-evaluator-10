
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { HEARTIAssessment, HEARTIDimension } from '../types';
import { Hexagon, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import OverviewTab from './results/OverviewTab';
import DimensionsTab from './results/DimensionsTab';
import ComparisonTab from './results/ComparisonTab';
import ReportTab from './results/ReportTab';
import HabitTab from './results/HabitTab';
import DevelopmentTab from './results/DevelopmentTab';
import DemographicsSection from './results/DemographicsSection';

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

  const exportPDF = async () => {
    if (!reportRef.current) return;
    
    setExportingPdf(true);
    
    try {
      const userName = assessment.demographics?.name || "Leader";
      const dateStr = format(new Date(assessment.date), 'yyyy-MM-dd');
      const fileName = `HEARTI-Leader-Report-${userName}-${dateStr}.pdf`;
      
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your report...",
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = 210;  // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10;      // margin in mm
      const contentWidth = pageWidth - (margin * 2);
      
      const reportSections = [];
      
      const addSection = (element) => {
        if (!element) return;
        reportSections.push(element);
      };
      
      const introSection = reportRef.current.querySelector('.prose:first-child');
      const spectraSection = reportRef.current.querySelector('.my-8');
      const dimensionCards = reportRef.current.querySelectorAll('.mb-8.overflow-hidden');
      const conclusionCard = reportRef.current.querySelector('.mb-8:not(.overflow-hidden)');
      
      addSection(introSection);
      
      addSection(spectraSection);
      
      dimensionCards.forEach(card => {
        addSection(card);
      });
      
      addSection(conclusionCard);
      
      let currentPage = 1;
      
      for (let i = 0; i < reportSections.length; i++) {
        const section = reportSections[i];
        
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.width = `${reportRef.current.offsetWidth}px`;
        tempDiv.style.background = 'white';
        tempDiv.style.overflow = 'hidden';
        
        const sectionClone = section.cloneNode(true);
        tempDiv.appendChild(sectionClone);
        document.body.appendChild(tempDiv);
        
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: 'white'
        });
        
        document.body.removeChild(tempDiv);
        
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) {
          pdf.addPage();
          currentPage++;
        }
        
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          margin,
          imgWidth,
          imgHeight
        );
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Page ${currentPage}`,
          pageWidth / 2,
          pageHeight - 5,
          { align: 'center' }
        );
      }
      
      pdf.save(fileName);
      
      toast({
        title: "PDF Generated",
        description: "Your HEARTI Leader report has been downloaded.",
      });
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
            
            <TabsContent value="overview" className="space-y-6">
              <OverviewTab assessment={assessment} />
            </TabsContent>
            
            <TabsContent value="dimensions" className="space-y-6">
              <DimensionsTab assessment={assessment} />
            </TabsContent>
            
            <TabsContent value="comparison" className="space-y-6">
              <ComparisonTab assessment={assessment} />
            </TabsContent>
            
            <TabsContent value="report" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">HEARTI:Leader Quotient Report</h3>
                  <p className="text-sm text-muted-foreground">Measuring Leadership Competencies Designed for the New World of Work</p>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={exportPDF}
                  disabled={exportingPdf}
                >
                  {exportingPdf ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  Export PDF
                </Button>
              </div>
              
              <div ref={reportRef} className="space-y-6 p-4">
                <ReportTab assessment={assessment} />
              </div>
            </TabsContent>
            
            <TabsContent value="habits" className="space-y-6">
              <HabitTab focusDimension={getTopDevelopmentArea()} />
            </TabsContent>
            
            <TabsContent value="development" className="space-y-6">
              <DevelopmentTab focusDimension={getTopDevelopmentArea()} />
            </TabsContent>
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
