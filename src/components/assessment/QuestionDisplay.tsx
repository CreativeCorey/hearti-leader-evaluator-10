
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { HEARTIQuestion } from '@/types';
import { getScoreLabel, scoreLabels } from '@/utils/assessmentUtils';

interface QuestionDisplayProps {
  question: HEARTIQuestion;
  currentScore: number;
  onAnswerChange: (score: number) => void;
  isMobile: boolean;
  transition: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentScore,
  onAnswerChange,
  isMobile,
  transition
}) => {
  return (
    <div className={`bg-muted/30 p-4 sm:p-6 rounded-lg transition-opacity duration-150 w-full max-w-screen-sm mx-auto ${transition ? 'opacity-0' : 'opacity-100'}`}>
      <h3 className="text-xl font-medium mb-4 sm:mb-6 text-center">{question.text}</h3>
      
      <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        <div className="px-0 sm:px-4">
          <Slider
            value={[currentScore]}
            min={1}
            max={5}
            step={1}
            onValueChange={value => onAnswerChange(value[0])}
            className="mb-4 sm:mb-6"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground pt-2">
            {scoreLabels.map(({ value, label }) => (
              <button
                key={value}
                className={`text-center text-xs sm:text-sm px-0 sm:px-1 py-2 rounded touch-manipulation hover:bg-primary/5 transition-colors ${
                  currentScore === value ? 'text-primary font-medium bg-primary/10' : ''
                }`}
                onClick={() => onAnswerChange(value)}
                aria-label={`Select ${label}`}
                style={{ minWidth: isMobile ? '45px' : 'auto' }}
              >
                {isMobile ? value : label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-4 sm:mt-6">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
            <span className="font-medium">Selected:</span> {getScoreLabel(currentScore)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
