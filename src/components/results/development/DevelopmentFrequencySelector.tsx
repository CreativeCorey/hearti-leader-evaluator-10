
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DevelopmentFrequencySelectorProps {
  selectedFrequency: 'daily' | 'weekly' | 'monthly';
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly') => void;
}

const DevelopmentFrequencySelector: React.FC<DevelopmentFrequencySelectorProps> = ({
  selectedFrequency,
  onFrequencyChange
}) => {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium mb-2 block">How often will you practice?</label>
      <Tabs value={selectedFrequency} onValueChange={(value) => onFrequencyChange(value as 'daily' | 'weekly' | 'monthly')}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DevelopmentFrequencySelector;
