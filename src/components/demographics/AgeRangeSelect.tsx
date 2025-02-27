
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AgeRange } from '@/types';

interface AgeRangeSelectProps {
  value: AgeRange;
  onChange: (value: AgeRange) => void;
}

const ranges = ['18 - 24', '25 - 34', '35 - 44', '45 - 54', '55 - 64', '65+', 'Decline to answer'];

const AgeRangeSelect: React.FC<AgeRangeSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">My age is...</h3>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as AgeRange)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {ranges.map((age) => (
            <div key={age} className="flex items-center space-x-2">
              <RadioGroupItem value={age} id={`age-${age}`} />
              <Label htmlFor={`age-${age}`}>{age}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default AgeRangeSelect;
