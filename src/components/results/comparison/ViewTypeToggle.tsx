
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

type ChartView = 'combined' | 'separate';

interface ViewTypeToggleProps {
  chartView: ChartView;
  setChartView: (view: ChartView) => void;
}

const ViewTypeToggle: React.FC<ViewTypeToggleProps> = ({ chartView, setChartView }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs mb-4 ${isMobile ? 'w-full' : ''}`}>
      <Button 
        size="sm" 
        variant={chartView === 'combined' ? "default" : "ghost"}
        className={`rounded-md text-xs h-7 ${isMobile ? 'flex-1' : ''}`}
        onClick={() => setChartView('combined')}
      >
        Combined
      </Button>
      <Button 
        size="sm" 
        variant={chartView === 'separate' ? "default" : "ghost"}
        className={`rounded-md text-xs h-7 ${isMobile ? 'flex-1' : ''}`}
        onClick={() => setChartView('separate')}
      >
        Separate
      </Button>
    </div>
  );
};

export default ViewTypeToggle;
