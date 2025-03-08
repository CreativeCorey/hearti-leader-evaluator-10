
import React from 'react';
import { Demographics } from '@/types';

interface DemographicsSectionProps {
  demographics: Demographics;
}

const DemographicsSection: React.FC<DemographicsSectionProps> = ({ demographics }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Demographic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demographics.managementLevel && (
          <div>
            <p className="font-medium">Management Level</p>
            <p className="text-muted-foreground">{demographics.managementLevel}</p>
          </div>
        )}
        
        {demographics.companySize && (
          <div>
            <p className="font-medium">Company Size</p>
            <p className="text-muted-foreground">{demographics.companySize}</p>
          </div>
        )}
        
        {demographics.jobRole && (
          <div>
            <p className="font-medium">Job Role</p>
            <p className="text-muted-foreground">{demographics.jobRole}</p>
          </div>
        )}
        
        {demographics.location && (
          <div>
            <p className="font-medium">Location</p>
            <p className="text-muted-foreground">{demographics.location}</p>
          </div>
        )}
        
        {demographics.ageRange && (
          <div>
            <p className="font-medium">Age Range</p>
            <p className="text-muted-foreground">{demographics.ageRange}</p>
          </div>
        )}
        
        {demographics.genderIdentity && (
          <div>
            <p className="font-medium">Gender Identity</p>
            <p className="text-muted-foreground">{demographics.genderIdentity}</p>
          </div>
        )}
        
        {demographics.raceEthnicity && demographics.raceEthnicity.length > 0 && (
          <div>
            <p className="font-medium">Race/Ethnicity</p>
            <p className="text-muted-foreground">{demographics.raceEthnicity.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemographicsSection;
