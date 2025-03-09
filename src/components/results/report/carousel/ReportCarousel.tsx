
import React from 'react';
import { HEARTIAssessment } from '@/types';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ReportHeader, SpectraCharts, DimensionCard, ReportFooter } from '../index';

interface ReportCarouselProps {
  assessment: HEARTIAssessment;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const ReportCarousel: React.FC<ReportCarouselProps> = ({ 
  assessment,
  currentPage,
  setCurrentPage
}) => {
  const totalPages = Object.keys(assessment.dimensionScores).length + 2; // Header, Charts, Dimensions, Footer

  return (
    <Carousel 
      className="w-full" 
      currentPage={currentPage}
      setActivePage={setCurrentPage}
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
  );
};

export default ReportCarousel;
