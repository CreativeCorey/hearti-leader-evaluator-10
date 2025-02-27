
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RaceEthnicitySelectProps {
  value: string[];
  onChange: (value: string, checked: boolean) => void;
}

const races = [
  'White or Caucasian',
  'Hispanic or Latino',
  'Black or African-American',
  'Asian or Pacific Islander',
  'Native American',
  'Indigenous People',
  'Multiracial or Biracial',
  'Race Ethnicity not listed here',
  'Decline to answer'
];

const RaceEthnicitySelect: React.FC<RaceEthnicitySelectProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">My Race/Ethnicity is...</h3>
      <p className="text-sm text-muted-foreground">(Please check all that apply)</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {races.map((race) => (
          <div key={race} className="flex items-center space-x-2">
            <Checkbox 
              id={`race-${race}`} 
              checked={value.includes(race)}
              onCheckedChange={(checked) => onChange(race, checked === true)}
            />
            <Label htmlFor={`race-${race}`}>{race}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RaceEthnicitySelect;
