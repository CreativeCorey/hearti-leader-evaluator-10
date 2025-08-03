
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { JobRole } from '@/types';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface JobRoleSelectProps {
  value: JobRole;
  onChange: (value: JobRole) => void;
}

const roles = [
  'C-Suite / Partner', 'Sales', 'Operations', 'Finance', 'Marketing', 
  'Engineering', 'Procurement', 'HR', 'Legal', 'Technology', 
  'Research and development', 'Production', 'Customer Service', 
  'Supply Chain', 'Management', 'Entrepreneur', 'Communications', 
  'Student', 'Investor', 'Educator', 'Athlete'
];

const JobRoleSelect: React.FC<JobRoleSelectProps> = ({ value, onChange }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg">{t('demographics.jobRole', { fallback: 'My main job role is...' })}</h3>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as JobRole)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {roles.map((role) => (
            <div key={role} className="flex items-center space-x-2">
              <RadioGroupItem value={role} id={`role-${role}`} />
              <Label htmlFor={`role-${role}`}>
                {t(`demographics.jobRoles.${role}`, { fallback: role })}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default JobRoleSelect;
