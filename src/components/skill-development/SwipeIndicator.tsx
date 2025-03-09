
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SwipeIndicatorProps {
  isMobile: boolean;
  isSaved: boolean;
  swipeState: 'default' | 'swiping-save' | 'swiping-tracker' | 'saved';
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({
  isMobile,
  isSaved,
  swipeState
}) => {
  if (!isMobile || isSaved) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 opacity-30">
      <div className={`${swipeState === 'swiping-save' ? 'opacity-100' : 'opacity-30'}`}>
        <ArrowRight className="h-6 w-6 text-blue-500" />
        <span className="text-xs">Save</span>
      </div>
      <div className={`${swipeState === 'swiping-tracker' ? 'opacity-100' : 'opacity-30'}`}>
        <ArrowLeft className="h-6 w-6 text-green-500" />
        <span className="text-xs">Add to Tracker</span>
      </div>
    </div>
  );
};

export default SwipeIndicator;
