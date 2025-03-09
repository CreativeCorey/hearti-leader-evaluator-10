
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobilePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageIndex: number) => void;
}

const MobilePagination: React.FC<MobilePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="flex justify-center items-center gap-3 mb-4">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
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
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default MobilePagination;
