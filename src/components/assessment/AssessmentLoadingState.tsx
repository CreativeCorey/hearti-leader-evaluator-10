
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface AssessmentLoadingStateProps {
  onComplete: () => void;
}

const AssessmentLoadingState: React.FC<AssessmentLoadingStateProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [currentDimension, setCurrentDimension] = useState(0);
  
  const dimensions = [
    'humility',
    'empathy',
    'accountability',
    'resiliency',
    'transparency',
    'inclusivity'
  ];

  // Simulate loading process
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Start with analyzing responses
    if (progress < 15) {
      timer = setTimeout(() => setProgress(prev => prev + 1), 50);
    }
    // Then process each dimension (15% - 85%)
    else if (progress < 85) {
      const dimensionIndex = Math.min(Math.floor((progress - 15) / 12), 5);
      
      if (dimensionIndex !== currentDimension) {
        setCurrentDimension(dimensionIndex);
      }
      
      timer = setTimeout(() => setProgress(prev => prev + 1), 80);
    }
    // Final loading (85% - 100%)
    else if (progress < 100) {
      timer = setTimeout(() => setProgress(prev => prev + 1), 60);
    }
    // Complete
    else {
      timer = setTimeout(() => {
        onComplete();
      }, 500);
    }
    
    return () => clearTimeout(timer);
  }, [progress, currentDimension, onComplete]);
  
  // Message based on progress
  const getMessage = () => {
    if (progress < 15) {
      return "Analyzing your responses...";
    } else if (progress < 25) {
      return "Building your leadership profile...";
    } else if (progress < 85) {
      const dimensionKey = dimensions[currentDimension];
      const dimensionName = t(`dimensions.titles.${dimensionKey}`) || 
        dimensionKey.charAt(0).toUpperCase() + dimensionKey.slice(1);
      return `Analyzing ${dimensionName} dimension...`;
    } else {
      return "Creating your personalized development program...";
    }
  };

  const getDimensionColor = () => {
    const colors = [
      'bg-purple', // humility
      'bg-blue-400', // empathy
      'bg-orange', // accountability
      'bg-green-500', // resiliency
      'bg-yellow-500', // transparency
      'bg-pink-500', // inclusivity
    ];
    
    if (progress < 15) return 'bg-purple';
    if (progress >= 85) return 'bg-gradient-to-r from-purple to-blue-400 via-green-500';
    
    return colors[currentDimension] || 'bg-purple';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 space-y-8">
      <div className="w-16 h-16 mb-4">
        <Loader2 className="w-16 h-16 animate-spin text-purple" />
      </div>
      
      <h2 className="text-2xl font-bold text-center text-purple">
        {t('assessment.loading.title')}
      </h2>
      
      <div className="w-full max-w-md space-y-3">
        <Progress 
          value={progress} 
          className="h-3 w-full" 
          indicatorClassName={getDimensionColor()}
        />
        <p className="text-center text-lg">{getMessage()}</p>
      </div>
      
      <p className="text-center text-muted-foreground max-w-md">
        {t('assessment.loading.message')}
      </p>
    </div>
  );
};

export default AssessmentLoadingState;
