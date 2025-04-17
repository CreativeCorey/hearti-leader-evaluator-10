
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface SalaryRangeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

const SalaryRangeSelect: React.FC<SalaryRangeSelectProps> = ({ 
  value, 
  onChange, 
  className 
}) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <Label className="text-base">Annual Salary Range</Label>
        <p className="text-sm text-muted-foreground">
          Select your annual salary range.
        </p>
      </div>
      
      <RadioGroup 
        value={value} 
        onValueChange={handleChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="$50K - $100K" id="salary-50-100" />
          <Label htmlFor="salary-50-100" className="font-normal">$50K - $100K</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="$101K - $150K" id="salary-101-150" />
          <Label htmlFor="salary-101-150" className="font-normal">$101K - $150K</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="$151K - $200K" id="salary-151-200" />
          <Label htmlFor="salary-151-200" className="font-normal">$151K - $200K</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="$201K - $300K" id="salary-201-300" />
          <Label htmlFor="salary-201-300" className="font-normal">$201K - $300K</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="$301K+" id="salary-301-plus" />
          <Label htmlFor="salary-301-plus" className="font-normal">$301K+</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Prefer not to say" id="salary-prefer-not-say" />
          <Label htmlFor="salary-prefer-not-say" className="font-normal">Prefer not to say</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SalaryRangeSelect;
