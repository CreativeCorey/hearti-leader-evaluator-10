
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartScatter } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

type CompareMode = 'none' | 'average';

interface ComparisonControlsProps {
  compareMode: CompareMode;
  setCompareMode: (mode: CompareMode) => void;
}

const ComparisonControls: React.FC<ComparisonControlsProps> = ({ compareMode, setCompareMode }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        size="sm" 
        variant={compareMode === 'none' ? "default" : "outline"}
        onClick={() => setCompareMode('none')}
      >
        {t('results.comparison.noComparison')}
      </Button>
      <Button 
        size="sm" 
        variant={compareMode === 'average' ? "default" : "outline"}
        onClick={() => setCompareMode('average')}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <ChartScatter size={16} className="mr-1" /> {t('results.comparison.average')}
      </Button>
    </div>
  );
};

export default ComparisonControls;
