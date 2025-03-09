
import React, { useState } from 'react';
import { HEARTIAssessment } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReportHeader, SpectraCharts, DimensionCard, ReportFooter } from './report';
import ShareButton from './sharing/ShareButton';
import LinkedInBadge from './sharing/LinkedInBadge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ReportTabProps {
  assessment: HEARTIAssessment;
  reportRef: React.RefObject<HTMLDivElement>;
  onExportPDF: () => Promise<void>;
  exportingPdf: boolean;
}

const ReportTab: React.FC<ReportTabProps> = ({ 
  assessment,
  reportRef, 
  onExportPDF,
  exportingPdf
}) => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Object.keys(assessment.dimensionScores).length + 2; // Header, Charts, 6 Dimensions, Footer
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">HEARTI:Leader Report</h2>
        <div className="flex gap-2">
          <Button 
            onClick={onExportPDF} 
            disabled={exportingPdf}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            {exportingPdf ? "Generating PDF..." : "Export PDF"}
          </Button>
        </div>
      </div>
      
      {/* Action buttons in a full-width container before the card */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-end mb-4">
        <LinkedInBadge assessment={assessment} />
        <ShareButton 
          assessment={assessment} 
          variant="outline"
          size={isMobile ? "sm" : "default"}
        />
      </div>
      
      {/* Mobile pagination indicator */}
      {isMobile && (
        <div className="flex justify-center items-center gap-3 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
      
      <Card className="p-6">
        <div className="pdf-container" ref={reportRef}>
          {/* For desktop, render everything as before */}
          {!isMobile ? (
            <>
              <ReportHeader assessment={assessment} />
              <SpectraCharts assessment={assessment as any} />
              <Separator className="my-8" />
              <div className="pdf-section mb-8">
                <h3 className="text-2xl font-medium mb-6 pdf-section-title">HEARTI:Leader Dimensions in Detail</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pdf-dimension-cards">
                  {Object.entries(assessment.dimensionScores).map(([dimension, score]) => (
                    <DimensionCard 
                      key={dimension} 
                      dimension={dimension as any}
                      score={score as any} 
                    />
                  ))}
                </div>
              </div>
              <ReportFooter />
            </>
          ) : (
            /* For mobile, render a carousel */
            <Carousel 
              className="w-full" 
              setActivePage={setCurrentPage}
              currentPage={currentPage}
            >
              <CarouselContent>
                {/* Page 1: Report Header */}
                <CarouselItem>
                  <div className="p-1">
                    <ReportHeader assessment={assessment} />
                  </div>
                </CarouselItem>
                
                {/* Page 2: Spectra Charts */}
                <CarouselItem>
                  <div className="p-1">
                    <h3 className="text-xl font-medium mb-4">HEARTI:Leader Spectra</h3>
                    <SpectraCharts assessment={assessment as any} />
                  </div>
                </CarouselItem>
                
                {/* Pages 3-8: Dimension Cards (one per page) */}
                {Object.entries(assessment.dimensionScores).map(([dimension, score], index) => (
                  <CarouselItem key={dimension}>
                    <div className="p-1">
                      <h3 className="text-xl font-medium mb-4">
                        {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                      </h3>
                      <DimensionCard 
                        dimension={dimension as any}
                        score={score as any} 
                      />
                    </div>
                  </CarouselItem>
                ))}
                
                {/* Last Page: Report Footer */}
                <CarouselItem>
                  <div className="p-1">
                    <ReportFooter />
                  </div>
                </CarouselItem>
              </CarouselContent>
              
              <div className="mt-4 flex items-center justify-center gap-2">
                <CarouselPrevious className="static translate-y-0 w-8 h-8" />
                <span className="text-sm text-muted-foreground">
                  {currentPage + 1} / {totalPages}
                </span>
                <CarouselNext className="static translate-y-0 w-8 h-8" />
              </div>
            </Carousel>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportTab;
