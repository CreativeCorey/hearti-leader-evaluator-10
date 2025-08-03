import { supabase } from '@/integrations/supabase/client';
import { HEARTIDimension } from '@/types';

export interface AggregateScores extends Record<string, number> {
  humility: number;
  empathy: number;
  accountability: number;
  resiliency: number;
  transparency: number;
  inclusivity: number;
}

export interface DemographicBreakdown {
  men: AggregateScores;
  women: AggregateScores;
}

export interface JobRoleBreakdown {
  engineering: AggregateScores;
  management: AggregateScores;
  executive: AggregateScores;
  other: AggregateScores;
}

export interface CompanySizeBreakdown {
  small: AggregateScores;
  medium: AggregateScores;
  large: AggregateScores;
}

export interface ManagementLevelBreakdown {
  individual: AggregateScores;
  manager: AggregateScores;
  executive: AggregateScores;
}

export interface RaceEthnicityBreakdown {
  white: AggregateScores;
  black: AggregateScores;
  hispanic: AggregateScores;
  asian: AggregateScores;
  other: AggregateScores;
}

export interface LocationBreakdown {
  northAmerica: AggregateScores;
  europe: AggregateScores;
  asia: AggregateScores;
  other: AggregateScores;
}

export interface SalaryBreakdown {
  under50k: AggregateScores;
  '50k-100k': AggregateScores;
  '100k-150k': AggregateScores;
  over150k: AggregateScores;
}

export interface AggregateData {
  averageScores: AggregateScores;
  demographics: {
    gender: DemographicBreakdown;
    jobRole: JobRoleBreakdown;
    companySize: CompanySizeBreakdown;
    managementLevel: ManagementLevelBreakdown;
    raceEthnicity: RaceEthnicityBreakdown;
    location: LocationBreakdown;
    salary: SalaryBreakdown;
  };
}

// Default fallback data (expanded with all demographic breakdowns)
const defaultAggregateData: AggregateData = {
  averageScores: {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  },
  demographics: {
    gender: {
      men: {
        humility: 3.6,
        empathy: 3.5,
        accountability: 4.0,
        resiliency: 3.8,
        transparency: 3.7,
        inclusivity: 3.3
      },
      women: {
        humility: 4.0,
        empathy: 3.9,
        accountability: 4.2,
        resiliency: 3.6,
        transparency: 4.1,
        inclusivity: 3.8
      }
    },
    jobRole: {
      engineering: {
        humility: 3.7,
        empathy: 3.4,
        accountability: 4.2,
        resiliency: 3.9,
        transparency: 3.8,
        inclusivity: 3.4
      },
      management: {
        humility: 3.9,
        empathy: 3.8,
        accountability: 4.0,
        resiliency: 3.6,
        transparency: 4.0,
        inclusivity: 3.6
      },
      executive: {
        humility: 3.5,
        empathy: 3.3,
        accountability: 4.3,
        resiliency: 4.0,
        transparency: 3.6,
        inclusivity: 3.2
      },
      other: {
        humility: 3.8,
        empathy: 3.7,
        accountability: 3.9,
        resiliency: 3.7,
        transparency: 3.9,
        inclusivity: 3.7
      }
    },
    companySize: {
      small: {
        humility: 4.0,
        empathy: 3.8,
        accountability: 3.9,
        resiliency: 3.8,
        transparency: 4.1,
        inclusivity: 3.7
      },
      medium: {
        humility: 3.8,
        empathy: 3.6,
        accountability: 4.1,
        resiliency: 3.7,
        transparency: 3.9,
        inclusivity: 3.5
      },
      large: {
        humility: 3.6,
        empathy: 3.4,
        accountability: 4.2,
        resiliency: 3.6,
        transparency: 3.7,
        inclusivity: 3.3
      }
    },
    managementLevel: {
      individual: {
        humility: 3.9,
        empathy: 3.7,
        accountability: 4.0,
        resiliency: 3.8,
        transparency: 3.9,
        inclusivity: 3.6
      },
      manager: {
        humility: 3.7,
        empathy: 3.5,
        accountability: 4.1,
        resiliency: 3.6,
        transparency: 3.8,
        inclusivity: 3.4
      },
      executive: {
        humility: 3.5,
        empathy: 3.3,
        accountability: 4.3,
        resiliency: 4.0,
        transparency: 3.6,
        inclusivity: 3.2
      }
    },
    raceEthnicity: {
      white: {
        humility: 3.7,
        empathy: 3.5,
        accountability: 4.1,
        resiliency: 3.7,
        transparency: 3.8,
        inclusivity: 3.4
      },
      black: {
        humility: 4.0,
        empathy: 3.9,
        accountability: 4.0,
        resiliency: 3.8,
        transparency: 4.1,
        inclusivity: 3.8
      },
      hispanic: {
        humility: 3.9,
        empathy: 3.8,
        accountability: 3.9,
        resiliency: 3.6,
        transparency: 4.0,
        inclusivity: 3.7
      },
      asian: {
        humility: 3.6,
        empathy: 3.4,
        accountability: 4.2,
        resiliency: 3.8,
        transparency: 3.7,
        inclusivity: 3.3
      },
      other: {
        humility: 3.8,
        empathy: 3.7,
        accountability: 4.0,
        resiliency: 3.7,
        transparency: 3.9,
        inclusivity: 3.6
      }
    },
    location: {
      northAmerica: {
        humility: 3.7,
        empathy: 3.5,
        accountability: 4.1,
        resiliency: 3.8,
        transparency: 3.8,
        inclusivity: 3.4
      },
      europe: {
        humility: 3.9,
        empathy: 3.7,
        accountability: 4.0,
        resiliency: 3.6,
        transparency: 4.0,
        inclusivity: 3.6
      },
      asia: {
        humility: 3.6,
        empathy: 3.4,
        accountability: 4.2,
        resiliency: 3.8,
        transparency: 3.7,
        inclusivity: 3.3
      },
      other: {
        humility: 3.8,
        empathy: 3.6,
        accountability: 3.9,
        resiliency: 3.7,
        transparency: 3.9,
        inclusivity: 3.5
      }
    },
    salary: {
      under50k: {
        humility: 3.9,
        empathy: 3.8,
        accountability: 3.9,
        resiliency: 3.7,
        transparency: 4.0,
        inclusivity: 3.7
      },
      '50k-100k': {
        humility: 3.8,
        empathy: 3.6,
        accountability: 4.1,
        resiliency: 3.7,
        transparency: 3.9,
        inclusivity: 3.5
      },
      '100k-150k': {
        humility: 3.7,
        empathy: 3.5,
        accountability: 4.2,
        resiliency: 3.8,
        transparency: 3.8,
        inclusivity: 3.4
      },
      over150k: {
        humility: 3.6,
        empathy: 3.3,
        accountability: 4.3,
        resiliency: 3.9,
        transparency: 3.7,
        inclusivity: 3.2
      }
    }
  }
};

function calculateAverageScores(assessments: any[]): AggregateScores {
  if (assessments.length === 0) {
    return defaultAggregateData.averageScores;
  }

  const totals = {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0
  };

  let validCount = 0;

  assessments.forEach(assessment => {
    if (assessment.dimension_scores && typeof assessment.dimension_scores === 'object') {
      const scores = assessment.dimension_scores;
      if (scores.humility && scores.empathy && scores.accountability && 
          scores.resiliency && scores.transparency && scores.inclusivity) {
        totals.humility += scores.humility;
        totals.empathy += scores.empathy;
        totals.accountability += scores.accountability;
        totals.resiliency += scores.resiliency;
        totals.transparency += scores.transparency;
        totals.inclusivity += scores.inclusivity;
        validCount++;
      }
    }
  });

  if (validCount === 0) {
    return defaultAggregateData.averageScores;
  }

  return {
    humility: Number((totals.humility / validCount).toFixed(2)),
    empathy: Number((totals.empathy / validCount).toFixed(2)),
    accountability: Number((totals.accountability / validCount).toFixed(2)),
    resiliency: Number((totals.resiliency / validCount).toFixed(2)),
    transparency: Number((totals.transparency / validCount).toFixed(2)),
    inclusivity: Number((totals.inclusivity / validCount).toFixed(2))
  };
}

function calculateDemographicScores(assessments: any[]): DemographicBreakdown {
  const menAssessments = assessments.filter(a => 
    a.demographics?.gender === 'Man' || a.demographics?.gender === 'man' ||
    a.demographics?.genderIdentity === 'man' || 
    a.demographics?.genderIdentity === 'male' ||
    a.demographics?.genderIdentity === 'Man' ||
    a.demographics?.genderIdentity === 'Male'
  );
  
  const womenAssessments = assessments.filter(a => 
    a.demographics?.gender === 'Woman' || a.demographics?.gender === 'woman' ||
    a.demographics?.genderIdentity === 'woman' || 
    a.demographics?.genderIdentity === 'female' ||
    a.demographics?.genderIdentity === 'Woman' ||
    a.demographics?.genderIdentity === 'Female'
  );

  return {
    men: calculateAverageScores(menAssessments),
    women: calculateAverageScores(womenAssessments)
  };
}

function calculateJobRoleScores(assessments: any[]): JobRoleBreakdown {
  const engineeringAssessments = assessments.filter(a => 
    a.demographics?.jobRole?.toLowerCase().includes('engineer') ||
    a.demographics?.jobRole?.toLowerCase().includes('developer') ||
    a.demographics?.jobRole?.toLowerCase().includes('programmer')
  );
  
  const managementAssessments = assessments.filter(a => 
    a.demographics?.managementLevel?.toLowerCase().includes('manager') ||
    a.demographics?.jobRole?.toLowerCase().includes('manager')
  );
  
  const executiveAssessments = assessments.filter(a => 
    a.demographics?.managementLevel?.toLowerCase().includes('executive') ||
    a.demographics?.managementLevel?.toLowerCase().includes('c-suite') ||
    a.demographics?.jobRole?.toLowerCase().includes('ceo') ||
    a.demographics?.jobRole?.toLowerCase().includes('cto') ||
    a.demographics?.jobRole?.toLowerCase().includes('cfo')
  );
  
  const otherAssessments = assessments.filter(a => 
    !engineeringAssessments.includes(a) && 
    !managementAssessments.includes(a) && 
    !executiveAssessments.includes(a)
  );

  return {
    engineering: calculateAverageScores(engineeringAssessments),
    management: calculateAverageScores(managementAssessments),
    executive: calculateAverageScores(executiveAssessments),
    other: calculateAverageScores(otherAssessments)
  };
}

function calculateCompanySizeScores(assessments: any[]): CompanySizeBreakdown {
  const smallAssessments = assessments.filter(a => 
    a.demographics?.companySize?.includes('1-50') ||
    a.demographics?.companySize?.includes('1-250') ||
    a.demographics?.companySize?.includes('51-250')
  );
  
  const mediumAssessments = assessments.filter(a => 
    a.demographics?.companySize?.includes('251-2,500') ||
    a.demographics?.companySize?.includes('501-1000') ||
    a.demographics?.companySize?.includes('1001-5000')
  );
  
  const largeAssessments = assessments.filter(a => 
    a.demographics?.companySize?.includes('2,501') ||
    a.demographics?.companySize?.includes('10,000+') ||
    a.demographics?.companySize?.includes('5001+')
  );

  return {
    small: calculateAverageScores(smallAssessments),
    medium: calculateAverageScores(mediumAssessments),
    large: calculateAverageScores(largeAssessments)
  };
}

function calculateManagementLevelScores(assessments: any[]): ManagementLevelBreakdown {
  const individualAssessments = assessments.filter(a => 
    a.demographics?.managementLevel?.toLowerCase().includes('individual')
  );
  
  const managerAssessments = assessments.filter(a => 
    a.demographics?.managementLevel?.toLowerCase().includes('manager') &&
    !a.demographics?.managementLevel?.toLowerCase().includes('individual')
  );
  
  const executiveAssessments = assessments.filter(a => 
    a.demographics?.managementLevel?.toLowerCase().includes('executive') ||
    a.demographics?.managementLevel?.toLowerCase().includes('c-suite')
  );

  return {
    individual: calculateAverageScores(individualAssessments),
    manager: calculateAverageScores(managerAssessments),
    executive: calculateAverageScores(executiveAssessments)
  };
}

function calculateRaceEthnicityScores(assessments: any[]): RaceEthnicityBreakdown {
  const whiteAssessments = assessments.filter(a => 
    a.demographics?.raceEthnicity?.toLowerCase().includes('white') ||
    a.demographics?.raceEthnicity?.toLowerCase().includes('caucasian')
  );
  
  const blackAssessments = assessments.filter(a => 
    a.demographics?.raceEthnicity?.toLowerCase().includes('black') ||
    a.demographics?.raceEthnicity?.toLowerCase().includes('african')
  );
  
  const hispanicAssessments = assessments.filter(a => 
    a.demographics?.raceEthnicity?.toLowerCase().includes('hispanic') ||
    a.demographics?.raceEthnicity?.toLowerCase().includes('latino') ||
    a.demographics?.raceEthnicity?.toLowerCase().includes('latina')
  );
  
  const asianAssessments = assessments.filter(a => 
    a.demographics?.raceEthnicity?.toLowerCase().includes('asian') ||
    a.demographics?.raceEthnicity?.toLowerCase().includes('pacific')
  );
  
  const otherAssessments = assessments.filter(a => 
    !whiteAssessments.includes(a) && 
    !blackAssessments.includes(a) && 
    !hispanicAssessments.includes(a) && 
    !asianAssessments.includes(a)
  );

  return {
    white: calculateAverageScores(whiteAssessments),
    black: calculateAverageScores(blackAssessments),
    hispanic: calculateAverageScores(hispanicAssessments),
    asian: calculateAverageScores(asianAssessments),
    other: calculateAverageScores(otherAssessments)
  };
}

function calculateLocationScores(assessments: any[]): LocationBreakdown {
  const northAmericaAssessments = assessments.filter(a => 
    a.demographics?.location?.toLowerCase().includes('united states') ||
    a.demographics?.location?.toLowerCase().includes('canada') ||
    a.demographics?.location?.toLowerCase().includes('usa') ||
    a.demographics?.location?.toLowerCase().includes('us')
  );
  
  const europeAssessments = assessments.filter(a => 
    a.demographics?.location?.toLowerCase().includes('united kingdom') ||
    a.demographics?.location?.toLowerCase().includes('germany') ||
    a.demographics?.location?.toLowerCase().includes('france') ||
    a.demographics?.location?.toLowerCase().includes('spain') ||
    a.demographics?.location?.toLowerCase().includes('italy') ||
    a.demographics?.location?.toLowerCase().includes('netherlands') ||
    a.demographics?.location?.toLowerCase().includes('uk')
  );
  
  const asiaAssessments = assessments.filter(a => 
    a.demographics?.location?.toLowerCase().includes('india') ||
    a.demographics?.location?.toLowerCase().includes('china') ||
    a.demographics?.location?.toLowerCase().includes('japan') ||
    a.demographics?.location?.toLowerCase().includes('singapore') ||
    a.demographics?.location?.toLowerCase().includes('australia')
  );
  
  const otherAssessments = assessments.filter(a => 
    !northAmericaAssessments.includes(a) && 
    !europeAssessments.includes(a) && 
    !asiaAssessments.includes(a)
  );

  return {
    northAmerica: calculateAverageScores(northAmericaAssessments),
    europe: calculateAverageScores(europeAssessments),
    asia: calculateAverageScores(asiaAssessments),
    other: calculateAverageScores(otherAssessments)
  };
}

function calculateSalaryScores(assessments: any[]): SalaryBreakdown {
  const under50kAssessments = assessments.filter(a => 
    a.demographics?.salaryRange?.includes('Under') ||
    a.demographics?.salaryRange?.includes('$25,000-$49,999') ||
    a.demographics?.salaryRange?.includes('Less than $50,000')
  );
  
  const _50kTo100kAssessments = assessments.filter(a => 
    a.demographics?.salaryRange?.includes('$50,000-$74,999') ||
    a.demographics?.salaryRange?.includes('$75,000-$99,999') ||
    a.demographics?.salaryRange?.includes('$50,000-$100,000')
  );
  
  const _100kTo150kAssessments = assessments.filter(a => 
    a.demographics?.salaryRange?.includes('$100,000-$124,999') ||
    a.demographics?.salaryRange?.includes('$125,000-$149,999') ||
    a.demographics?.salaryRange?.includes('$100,000-$150,000')
  );
  
  const over150kAssessments = assessments.filter(a => 
    a.demographics?.salaryRange?.includes('$150,000') ||
    a.demographics?.salaryRange?.includes('$200,000') ||
    a.demographics?.salaryRange?.includes('Over $150,000')
  );

  return {
    under50k: calculateAverageScores(under50kAssessments),
    '50k-100k': calculateAverageScores(_50kTo100kAssessments),
    '100k-150k': calculateAverageScores(_100kTo150kAssessments),
    over150k: calculateAverageScores(over150kAssessments)
  };
}

export async function fetchAggregateData(): Promise<AggregateData> {
  try {
    // Fetch all assessments with dimension scores and demographics
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('dimension_scores, demographics')
      .not('dimension_scores', 'is', null)
      .not('demographics', 'is', null);

    if (error) {
      console.error('Error fetching assessments for aggregate data:', error);
      return defaultAggregateData;
    }

    if (!assessments || assessments.length === 0) {
      console.log('No assessments found, using default aggregate data');
      return defaultAggregateData;
    }

    console.log(`Calculating aggregate data from ${assessments.length} assessments`);

    const averageScores = calculateAverageScores(assessments);
    const genderDemographics = calculateDemographicScores(assessments);
    const jobRoleDemographics = calculateJobRoleScores(assessments);
    const companySizeDemographics = calculateCompanySizeScores(assessments);
    const managementLevelDemographics = calculateManagementLevelScores(assessments);
    const raceEthnicityDemographics = calculateRaceEthnicityScores(assessments);
    const locationDemographics = calculateLocationScores(assessments);
    const salaryDemographics = calculateSalaryScores(assessments);

    return {
      averageScores,
      demographics: {
        gender: genderDemographics,
        jobRole: jobRoleDemographics,
        companySize: companySizeDemographics,
        managementLevel: managementLevelDemographics,
        raceEthnicity: raceEthnicityDemographics,
        location: locationDemographics,
        salary: salaryDemographics
      }
    };
  } catch (error) {
    console.error('Error calculating aggregate data:', error);
    return defaultAggregateData;
  }
}

// Cache the aggregate data for performance
let cachedAggregateData: AggregateData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes - longer cache for stability

export async function getAggregateData(): Promise<AggregateData> {
  const now = Date.now();
  
  if (cachedAggregateData && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Using cached aggregate data');
    return cachedAggregateData;
  }
  
  console.log('Fetching fresh aggregate data');
  cachedAggregateData = await fetchAggregateData();
  lastFetchTime = now;
  
  return cachedAggregateData;
}

// Function to invalidate cache when new data is imported
export function invalidateAggregateDataCache(): void {
  cachedAggregateData = null;
  lastFetchTime = 0;
}