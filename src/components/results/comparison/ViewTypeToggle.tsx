
import React from 'react';
import { Button } from '@/components/ui/button';

type ChartView = 'combined' | 'separate';

interface ViewTypeToggleProps {
  chartView: ChartView;
  setChartView: (view: ChartView) => void;
}

const ViewTypeToggle: React.FC<ViewTypeToggleProps> = ({ chartView, setChartView }) => {
  return (
    <div className="p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs mb-4">
      <Button 
        size="sm" 
        variant={chartView === 'combined' ? "default" : "ghost"}
        className="rounded-md text-xs h-7"
        onClick={() => setChartView('combined')}
      >
        Combined
      </Button>
      <Button 
        size="sm" 
        variant={chartView === 'separate' ? "default" : "ghost"}
        className="rounded-md text-xs h-7"
        onClick={() => setChartView('separate')}
      >
        Separate
      </Button>
    </div>
  );
};

export default ViewTypeToggle;
