
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Demographics } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Import the componentized form sections
import ManagementLevelSelect from './demographics/ManagementLevelSelect';
import CompanySizeSelect from './demographics/CompanySizeSelect';
import JobRoleSelect from './demographics/JobRoleSelect';
import LocationSelect from './demographics/LocationSelect';
import AgeRangeSelect from './demographics/AgeRangeSelect';
import GenderIdentitySelect from './demographics/GenderIdentitySelect';
import RaceEthnicitySelect from './demographics/RaceEthnicitySelect';

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
        <ManagementLevelSelect 
          value={demographics.managementLevel} 
          onChange={(value) => setDemographics(prev => ({ ...prev, managementLevel: value }))}
        />

        {/* Company Size */}
        <CompanySizeSelect 
          value={demographics.companySize} 
          onChange={(value) => setDemographics(prev => ({ ...prev, companySize: value }))}
        />

        {/* Job Role */}
        <JobRoleSelect 
          value={demographics.jobRole} 
          onChange={(value) => setDemographics(prev => ({ ...prev, jobRole: value }))}
        />

        {/* Location */}
        <LocationSelect 
          value={locationInput} 
          onChange={setLocationInput}
        />

        {/* Age Range */}
        <AgeRangeSelect 
          value={demographics.ageRange} 
          onChange={(value) => setDemographics(prev => ({ ...prev, ageRange: value }))}
        />

        {/* Gender Identity */}
        <GenderIdentitySelect 
          value={demographics.genderIdentity} 
          onChange={(value) => setDemographics(prev => ({ ...prev, genderIdentity: value }))}
        />

        {/* Race/Ethnicity */}
        <RaceEthnicitySelect 
          value={raceEthnicity} 
          onChange={handleRaceEthnicityChange}
        />
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
