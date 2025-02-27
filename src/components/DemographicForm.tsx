
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Demographics, 
  ManagementLevel, 
  CompanySize, 
  JobRole, 
  AgeRange, 
  GenderIdentity,
  RaceEthnicity
} from '@/types';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface DemographicFormProps {
  onComplete: (demographics: Demographics) => void;
  onSkip: () => void;
}

const DemographicForm: React.FC<DemographicFormProps> = ({ onComplete, onSkip }) => {
  const { toast } = useToast();
  const [demographics, setDemographics] = useState<Demographics>({});
  const [locationInput, setLocationInput] = useState<string>('');
  const [raceEthnicity, setRaceEthnicity] = useState<string[]>([]);

  const handleRaceEthnicityChange = (value: string, checked: boolean) => {
    if (checked) {
      setRaceEthnicity(prev => [...prev, value]);
    } else {
      setRaceEthnicity(prev => prev.filter(item => item !== value));
    }
  };

  const handleSubmit = () => {
    // Update the final demographics with race/ethnicity
    const finalDemographics: Demographics = {
      ...demographics,
      location: locationInput || undefined,
      raceEthnicity: raceEthnicity.length > 0 ? raceEthnicity : undefined
    };
    
    onComplete(finalDemographics);
    
    toast({
      title: "Demographics saved",
      description: "Thank you for providing this information."
    });
  };

  return (
    <Card className="w-full appear-animate shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Demographic Information</CardTitle>
        <CardDescription>
          This information helps us understand our user base better. All questions are optional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Management Level */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">My current management level is...</h3>
          <RadioGroup 
            value={demographics.managementLevel} 
            onValueChange={(value) => setDemographics(prev => ({ ...prev, managementLevel: value as ManagementLevel }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {['Individual Contributor', 'Manager', 'Director', 'VP', 
                'C-Suite', 'Entrepreneur', 'Student', 'Not Employed'].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`management-${level}`} />
                  <Label htmlFor={`management-${level}`}>{level}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Company Size */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">My company size is...</h3>
          <RadioGroup 
            value={demographics.companySize} 
            onValueChange={(value) => setDemographics(prev => ({ ...prev, companySize: value as CompanySize }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {['1 - 250 Employees', '251 - 2,000 Employees', '2,501 - 10,000 Employees', 
                '10,000+ Employees', 'Not Employed'].map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <RadioGroupItem value={size} id={`company-${size}`} />
                  <Label htmlFor={`company-${size}`}>{size}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Job Role */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">My main job role is...</h3>
          <RadioGroup 
            value={demographics.jobRole} 
            onValueChange={(value) => setDemographics(prev => ({ ...prev, jobRole: value as JobRole }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['C-Suite / Partner', 'Sales', 'Operations', 'Finance', 'Marketing', 
                'Engineering', 'Procurement', 'HR', 'Legal', 'Technology', 
                'Research and development', 'Production', 'Customer Service', 
                'Supply Chain', 'Management', 'Entrepreneur', 'Communications', 'Student'].map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <RadioGroupItem value={role} id={`role-${role}`} />
                  <Label htmlFor={`role-${role}`}>{role}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">Where are you located?</h3>
          <p className="text-sm text-muted-foreground">Please enter your U.S. state or international business region</p>
          <Input 
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="e.g., California, Western Europe, Asia Pacific"
            className="max-w-md"
          />
        </div>

        {/* Age Range */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">My age is...</h3>
          <RadioGroup 
            value={demographics.ageRange} 
            onValueChange={(value) => setDemographics(prev => ({ ...prev, ageRange: value as AgeRange }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['18 - 24', '25 - 34', '35 - 44', '45 - 54', '55 - 64', '65+', 'Decline to answer'].map((age) => (
                <div key={age} className="flex items-center space-x-2">
                  <RadioGroupItem value={age} id={`age-${age}`} />
                  <Label htmlFor={`age-${age}`}>{age}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Gender Identity */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">My gender identity is...</h3>
          <RadioGroup 
            value={demographics.genderIdentity} 
            onValueChange={(value) => setDemographics(prev => ({ ...prev, genderIdentity: value as GenderIdentity }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {['Man', 'Woman', 'Non-Binary / Gender Non-conforming', 'Decline to answer'].map((gender) => (
                <div key={gender} className="flex items-center space-x-2">
                  <RadioGroupItem value={gender} id={`gender-${gender}`} />
                  <Label htmlFor={`gender-${gender}`}>{gender}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Race/Ethnicity */}
        <div className="space-y-3">
          <h3 className="font-medium text-lg">My Race/Ethnicity is...</h3>
          <p className="text-sm text-muted-foreground">(Please check all that apply)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'White or Caucasian',
              'Hispanic or Latino',
              'Black or African-American',
              'Asian or Pacific Islander',
              'Native American',
              'Indigenous People',
              'Multiracial or Biracial',
              'Race Ethnicity not listed here',
              'Decline to answer'
            ].map((race) => (
              <div key={race} className="flex items-center space-x-2">
                <Checkbox 
                  id={`race-${race}`} 
                  checked={raceEthnicity.includes(race)}
                  onCheckedChange={(checked) => handleRaceEthnicityChange(race, checked === true)}
                />
                <Label htmlFor={`race-${race}`}>{race}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip
        </Button>
        <Button onClick={handleSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemographicForm;
