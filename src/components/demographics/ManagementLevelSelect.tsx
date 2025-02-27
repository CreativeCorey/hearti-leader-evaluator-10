
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ManagementLevel } from '@/types';

interface ManagementLevelSelectProps {
  value: ManagementLevel;
  onChange: (value: ManagementLevel) => void;
}

const levels = [
  'Individual Contributor', 'Manager', 'Director', 'VP', 
  'C-Suite', 'Entrepreneur', 'Student', 'Not Employed'
];

const ManagementLevelSelect: React.FC<ManagementLevelSelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">My current management level is...</h3>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as ManagementLevel)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {levels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={`management-${level}`} />
              <Label htmlFor={`management-${level}`}>{level}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ManagementLevelSelect;
