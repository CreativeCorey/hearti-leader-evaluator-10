
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
      <div className="question-container min-h-[100px] flex items-center justify-center mb-4">
        <h3 className="text-lg sm:text-xl font-medium text-center">{question.text}</h3>
      </div>
      
      <div className="space-y-4">
        <div className="px-2 sm:px-6">
          <Slider
            value={[currentScore]}
            min={1}
            max={5}
            step={1}
            onValueChange={value => onAnswerChange(value[0])}
            className="mb-4"
            aria-label="Select answer value"
          />
          
          <div className="flex justify-between text-sm text-muted-foreground pt-1">
            {scoreLabels.map(({ value, label }) => (
              <button
                key={value}
                className={`text-center text-xs sm:text-sm px-1 sm:px-2 py-1 rounded-lg touch-manipulation hover:bg-primary/5 transition-colors ${
                  currentScore === value ? 'text-primary font-medium bg-primary/10' : ''
                }`}
                onClick={() => onAnswerChange(value)}
                aria-label={`Select ${label}`}
                style={{ width: '20%', textAlign: 'center' }}
              >
                {isMobile ? value : label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-3">
          <div className="inline-block px-3 py-1.5 bg-primary/10 rounded-lg">
            <span className="font-medium">Selected:</span> {getScoreLabel(currentScore)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
