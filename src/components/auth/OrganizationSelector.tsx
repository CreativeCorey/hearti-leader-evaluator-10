
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Organization {
  id: string;
  name: string;
}

interface OrganizationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({ value, onChange }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([
    { id: 'prismwork', name: 'PrismWork' },
    { id: 'prismwork-beta', name: 'HEARTI Beta Test Group' },
    { id: 'utd-capstone', name: 'UTD Capstone' },
    { id: 'none', name: 'No Organization' }
  ]);

  return (
    <div className="space-y-2">
      <Label htmlFor="organization-select">Organization</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="organization-select" className="w-full">
          <SelectValue placeholder="Select an organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map(org => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrganizationSelector;
