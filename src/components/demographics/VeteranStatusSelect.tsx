import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface VeteranStatusSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const VeteranStatusSelect: React.FC<VeteranStatusSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">Are you a military veteran?</h3>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Yes" id="veteran-yes" />
            <Label htmlFor="veteran-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="No" id="veteran-no" />
            <Label htmlFor="veteran-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Prefer not to answer" id="veteran-prefer-not" />
            <Label htmlFor="veteran-prefer-not">Prefer not to answer</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default VeteranStatusSelect;