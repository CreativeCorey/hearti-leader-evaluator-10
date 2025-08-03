import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DisabilityStatusSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const DisabilityStatusSelect: React.FC<DisabilityStatusSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">Do you identify as someone with a disability?</h3>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="disability-yes" />
            <Label htmlFor="disability-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="disability-no" />
            <Label htmlFor="disability-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Prefer not to answer" id="disability-prefer-not" />
            <Label htmlFor="disability-prefer-not">Prefer not to answer</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DisabilityStatusSelect;