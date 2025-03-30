
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface ActivityFrequencySelectorProps {
  frequency: 'daily' | 'weekly' | 'monthly';
  setFrequency: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const ActivityFrequencySelector: React.FC<ActivityFrequencySelectorProps> = ({
  frequency,
  setFrequency,
  onCancel,
  onConfirm
}) => {
  return (
    <div className="mt-2 bg-muted p-2 rounded-md">
      <p className="text-xs font-medium mb-2 flex items-center">
        <Clock size={14} className="mr-1" />
        Select Frequency:
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
      
      <div className="mt-2 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs py-1 px-2 h-auto"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="text-xs py-1 px-2 h-auto"
          onClick={onConfirm}
        >
          Add to Tracker
        </Button>
      </div>
    </div>
  );
};

export default ActivityFrequencySelector;
