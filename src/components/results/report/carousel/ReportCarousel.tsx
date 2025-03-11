
import React from 'react';
import { HEARTIAssessment } from '@/types';
import ReportHeader from '../ReportHeader';
import SpectraCharts from '../SpectraCharts';
import DimensionCard from '../DimensionCard';
import ReportFooter from '../ReportFooter';

interface ReportCarouselProps {
  assessment: HEARTIAssessment;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  assessments?: HEARTIAssessment[];
}

const ReportCarousel: React.FC<ReportCarouselProps> = ({ 
  assessment, 
  currentPage,
  setCurrentPage,
  assessments = []
}) => {
  // Extract dimensions to display
  const dimensionEntries = Object.entries(assessment.dimensionScores);
  
  // Function to render the current page content
  const renderPageContent = () => {
    // Page 0: Header
    if (currentPage === 0) {
      return <ReportHeader assessment={assessment} />;
    }
    
    // Page 1: Charts
    if (currentPage === 1) {
      return <SpectraCharts assessment={assessment} assessments={assessments} />;
    }
    
    // Pages 2-7: Dimension cards (one per page)
    if (currentPage >= 2 && currentPage < dimensionEntries.length + 2) {
      const dimensionIndex = currentPage - 2;
      const [dimension, score] = dimensionEntries[dimensionIndex];
      
      return (
        <div className="pdf-section">
          <h3 className="text-2xl font-medium mb-4 pdf-section-title">HEARTI Dimension Analysis</h3>
          <DimensionCard 
            dimension={dimension as 'humility' | 'empathy' | 'accountability' | 'resiliency' | 'transparency' | 'inclusivity'}
            score={score}
          />
        </div>
      );
    }
    
    // Last page: Footer
    return <ReportFooter />;
  };
  
  // Handle page navigation
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < dimensionEntries.length + 2) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return (
    <div className="relative pdf-page">
      {/* Page content */}
      <div className="min-h-[70vh]">
        {renderPageContent()}
      </div>
      
      {/* Navigation buttons for swipe */}
      <div className="absolute inset-0 flex" onClick={(e) => e.stopPropagation()}>
        <div className="w-1/3 h-full" onClick={goToPrevPage} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full" onClick={goToNextPage} />
      </div>
    </div>
  );
};

export default ReportCarousel;
