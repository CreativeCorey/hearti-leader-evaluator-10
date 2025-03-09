
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Clock } from 'lucide-react';

interface FrequencySelectorProps {
  frequency: 'daily' | 'weekly' | 'monthly';
  setFrequency: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  className?: string;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ 
  frequency, 
  setFrequency,
  className = ''
}) => {
  return (
    <div className={`bg-muted p-2 rounded-md ${className}`}>
      <p className="text-xs font-medium mb-2 flex items-center">
        <Clock size={14} className="mr-1" />
        Frequency:
      </p>
      <div className="flex gap-2">
        <Toggle
          pressed={frequency === 'daily'}
          onPressedChange={() => setFrequency('daily')}
          className={`text-xs py-1 px-2 h-auto rounded ${frequency === 'daily' ? 'bg-blue-100 border-blue-300 text-blue-800' : ''}`}
          size="sm"
        >
          Daily
        </Toggle>
        <Toggle
          pressed={frequency === 'weekly'}
          onPressedChange={() => setFrequency('weekly')}
          className={`text-xs py-1 px-2 h-auto rounded ${frequency === 'weekly' ? 'bg-purple-100 border-purple-300 text-purple-800' : ''}`}
          size="sm"
        >
          Weekly
        </Toggle>
        <Toggle
          pressed={frequency === 'monthly'}
          onPressedChange={() => setFrequency('monthly')}
          className={`text-xs py-1 px-2 h-auto rounded ${frequency === 'monthly' ? 'bg-orange-100 border-orange-300 text-orange-800' : ''}`}
          size="sm"
        >
          Monthly
        </Toggle>
      </div>
    </div>
  );
};

export default FrequencySelector;
