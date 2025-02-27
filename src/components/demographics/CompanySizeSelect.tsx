
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CompanySize } from '@/types';

interface CompanySizeSelectProps {
  value: CompanySize;
  onChange: (value: CompanySize) => void;
}

const sizes = [
  '1 - 250 Employees', '251 - 2,000 Employees', '2,501 - 10,000 Employees', 
  '10,000+ Employees', 'Not Employed'
];

const CompanySizeSelect: React.FC<CompanySizeSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">My company size is...</h3>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as CompanySize)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <RadioGroupItem value={size} id={`company-${size}`} />
              <Label htmlFor={`company-${size}`}>{size}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default CompanySizeSelect;
