import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Demographics } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Import the componentized form sections
import ManagementLevelSelect from './demographics/ManagementLevelSelect';
import CompanySizeSelect from './demographics/CompanySizeSelect';
import JobRoleSelect from './demographics/JobRoleSelect';
import LocationSelect from './demographics/LocationSelect';
import AgeRangeSelect from './demographics/AgeRangeSelect';
import GenderIdentitySelect from './demographics/GenderIdentitySelect';
import RaceEthnicitySelect from './demographics/RaceEthnicitySelect';
import SalaryRangeSelect from './demographics/SalaryRangeSelect';

interface DemographicFormProps {
  onComplete: (demographics: Demographics) => void;
  onSkip: () => void;
  existingDemographics?: Demographics;
}

const DemographicForm: React.FC<DemographicFormProps> = ({ 
  onComplete, 
  onSkip, 
  existingDemographics 
}) => {
  const { toast } = useToast();
  const [demographics, setDemographics] = useState<Demographics>(existingDemographics || {});
  const [workplaceChanged, setWorkplaceChanged] = useState<boolean>(false);
  const [locationInput, setLocationInput] = useState<string>('');
  const [raceEthnicity, setRaceEthnicity] = useState<string[]>([]);
  const [showingFullForm, setShowingFullForm] = useState<boolean>(true);

  const hasExistingDemographics = !!existingDemographics && 
    Object.keys(existingDemographics).length > 0;

  useEffect(() => {
    if (hasExistingDemographics) {
      setShowingFullForm(false);
      
      if (existingDemographics?.location) {
        setLocationInput(existingDemographics.location);
      }
      
      if (existingDemographics?.raceEthnicity && existingDemographics.raceEthnicity.length > 0) {
        setRaceEthnicity(existingDemographics.raceEthnicity);
      }
    }
  }, [existingDemographics, hasExistingDemographics]);

  const handleRaceEthnicityChange = (value: string, checked: boolean) => {
    if (checked) {
      setRaceEthnicity(prev => [...prev, value]);
    } else {
      setRaceEthnicity(prev => prev.filter(item => item !== value));
    }
  };

  const handleSubmit = () => {
    let finalDemographics: Demographics = {};
    
    if (hasExistingDemographics && !workplaceChanged && !showingFullForm) {
      finalDemographics = {
        ...existingDemographics,
      };
    } else {
      finalDemographics = {
        ...demographics,
        location: locationInput || undefined,
        raceEthnicity: raceEthnicity.length > 0 ? raceEthnicity : undefined
      };
    }
    
    onComplete(finalDemographics);
    
    toast({
      title: "Demographics saved",
      description: "Thank you for providing this information."
    });
  };

  const toggleFullForm = () => {
    setShowingFullForm(!showingFullForm);
    setWorkplaceChanged(true);
  };

  return (
    <Card className="w-full appear-animate shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Demographic Information</CardTitle>
        <CardDescription>
          This information helps us understand our user base better. All questions are optional.
        </CardDescription>
        
        {hasExistingDemographics && (
          <div className="mt-4 pb-2 border-b">
            <div className="flex items-center space-x-2">
              <Switch 
                id="workplace-changed" 
                checked={workplaceChanged || showingFullForm}
                onCheckedChange={(checked) => {
                  setWorkplaceChanged(checked);
                  if (!checked) {
                    setShowingFullForm(false);
                  }
                }}
              />
              <Label htmlFor="workplace-changed">My workplace status has changed</Label>
            </div>
            
            <div className="mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm" 
                onClick={toggleFullForm}
              >
                {showingFullForm ? "Show simplified form" : "Show all demographic questions"}
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-8">
        <ManagementLevelSelect 
          value={demographics.managementLevel} 
          onChange={(value) => setDemographics(prev => ({ ...prev, managementLevel: value }))}
        />

        <CompanySizeSelect 
          value={demographics.companySize} 
          onChange={(value) => setDemographics(prev => ({ ...prev, companySize: value }))}
        />

        <JobRoleSelect 
          value={demographics.jobRole} 
          onChange={(value) => setDemographics(prev => ({ ...prev, jobRole: value }))}
        />

        <SalaryRangeSelect
          value={demographics.salaryRange}
          onChange={(value) => setDemographics(prev => ({ ...prev, salaryRange: value }))}
        />

        {showingFullForm && (
          <>
            <LocationSelect 
              value={locationInput} 
              onChange={setLocationInput}
            />

            <AgeRangeSelect 
              value={demographics.ageRange} 
              onChange={(value) => setDemographics(prev => ({ ...prev, ageRange: value }))}
            />

            <GenderIdentitySelect 
              value={demographics.genderIdentity} 
              onChange={(value) => setDemographics(prev => ({ ...prev, genderIdentity: value }))}
            />

            <RaceEthnicitySelect 
              value={raceEthnicity} 
              onChange={handleRaceEthnicityChange}
            />
          </>
        )}
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
