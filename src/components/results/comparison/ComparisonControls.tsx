
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartScatter } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

type CompareMode = 'none' | 'average' | 'gender' | 'jobRole' | 'companySize' | 'managementLevel';

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
      <Button 
        size="sm" 
        variant={compareMode === 'gender' ? "default" : "outline"}
        onClick={() => setCompareMode('gender')}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Gender
      </Button>
      <Button 
        size="sm" 
        variant={compareMode === 'jobRole' ? "default" : "outline"}
        onClick={() => setCompareMode('jobRole')}
        className="bg-green-600 hover:bg-green-700"
      >
        Job Role
      </Button>
      <Button 
        size="sm" 
        variant={compareMode === 'companySize' ? "default" : "outline"}
        onClick={() => setCompareMode('companySize')}
        className="bg-orange-600 hover:bg-orange-700"
      >
        Company Size
      </Button>
      <Button 
        size="sm" 
        variant={compareMode === 'managementLevel' ? "default" : "outline"}
        onClick={() => setCompareMode('managementLevel')}
        className="bg-red-600 hover:bg-red-700"
      >
        Management Level
      </Button>
    </div>
  );
};

export default ComparisonControls;
