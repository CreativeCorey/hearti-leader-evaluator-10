
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface ComparisonControlsProps {
  compareMode: 'none' | 'average' | 'men' | 'women';
  setCompareMode: (mode: 'none' | 'average' | 'men' | 'women') => void;
  chartView: 'combined' | 'separate';
  setChartView: (view: 'combined' | 'separate') => void;
}

const ComparisonControls: React.FC<ComparisonControlsProps> = ({
  compareMode,
  setCompareMode,
  chartView,
  setChartView
}) => {
  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Compare Your Results</h3>
          <p className="text-sm text-muted-foreground">See how your scores compare to others</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant={compareMode === 'none' ? "default" : "outline"}
            onClick={() => setCompareMode('none')}
          >
            No Comparison
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'average' ? "gradient-purple" : "outline"}
            onClick={() => setCompareMode('average')}
            className="hover:bg-purple-700"
          >
            <Users size={16} className="mr-1" /> Average
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'men' ? "gradient-red" : "outline"}
            onClick={() => setCompareMode('men')}
            className="hover:bg-red-700"
          >
            Men
          </Button>
          <Button 
            size="sm" 
            variant={compareMode === 'women' ? "gradient-blue" : "outline"}
            onClick={() => setCompareMode('women')}
            className="hover:bg-blue-700"
          >
            Women
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs mb-4">
          <Button 
            size="sm" 
            variant={chartView === 'combined' ? "gradient" : "ghost"}
            className="rounded-md text-xs h-7"
            onClick={() => setChartView('combined')}
          >
            Combined
          </Button>
          <Button 
            size="sm" 
            variant={chartView === 'separate' ? "gradient" : "ghost"}
            className="rounded-md text-xs h-7"
            onClick={() => setChartView('separate')}
          >
            Separate
          </Button>
        </div>
      </div>
    </>
  );
};

export default ComparisonControls;
