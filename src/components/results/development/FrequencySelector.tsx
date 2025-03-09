
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Clock } from 'lucide-react';

interface FrequencySelectorProps {
  selectedFrequency: 'daily' | 'weekly' | 'monthly';
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly') => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  selectedFrequency,
  onFrequencyChange
}) => {
  return (
    <div className="mb-3">
      <label className="text-sm flex items-center gap-1 mb-1 text-indigo-700">
        <Clock size={14} />
        Frequency:
      </label>
      <div className="flex gap-2">
        <Toggle
          pressed={selectedFrequency === 'daily'}
          onPressedChange={() => onFrequencyChange('daily')}
          className={`flex-1 text-xs py-1 px-2 h-8 ${selectedFrequency === 'daily' ? 'bg-blue-100 border-blue-300 text-blue-800' : ''}`}
        >
          Daily
        </Toggle>
        <Toggle
          pressed={selectedFrequency === 'weekly'}
          onPressedChange={() => onFrequencyChange('weekly')}
          className={`flex-1 text-xs py-1 px-2 h-8 ${selectedFrequency === 'weekly' ? 'bg-purple-100 border-purple-300 text-purple-800' : ''}`}
        >
          Weekly
        </Toggle>
        <Toggle
          pressed={selectedFrequency === 'monthly'}
          onPressedChange={() => onFrequencyChange('monthly')}
          className={`flex-1 text-xs py-1 px-2 h-8 ${selectedFrequency === 'monthly' ? 'bg-orange-100 border-orange-300 text-orange-800' : ''}`}
        >
          Monthly
        </Toggle>
      </div>
    </div>
  );
};

export default FrequencySelector;
