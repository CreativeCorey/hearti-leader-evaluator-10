
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GenderIdentity } from '@/types';

interface GenderIdentitySelectProps {
  value: GenderIdentity;
  onChange: (value: GenderIdentity) => void;
}

const genders = ['Man', 'Woman', 'Non-Binary / Gender Non-conforming', 'Decline to answer'];

const GenderIdentitySelect: React.FC<GenderIdentitySelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">My gender identity is...</h3>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as GenderIdentity)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {genders.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <RadioGroupItem value={gender} id={`gender-${gender}`} />
              <Label htmlFor={`gender-${gender}`}>{gender}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default GenderIdentitySelect;
