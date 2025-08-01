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

export interface AggregateData {
  averageScores: AggregateScores;
  demographics: {
    gender: DemographicBreakdown;
  };
}

// Default fallback data (your original hardcoded values)
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
    a.demographics?.genderIdentity === 'man' || 
    a.demographics?.genderIdentity === 'male' ||
    a.demographics?.genderIdentity === 'Man' ||
    a.demographics?.genderIdentity === 'Male'
  );
  
  const womenAssessments = assessments.filter(a => 
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
    const demographics = calculateDemographicScores(assessments);

    return {
      averageScores,
      demographics: {
        gender: demographics
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
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getAggregateData(): Promise<AggregateData> {
  const now = Date.now();
  
  if (cachedAggregateData && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedAggregateData;
  }
  
  cachedAggregateData = await fetchAggregateData();
  lastFetchTime = now;
  
  return cachedAggregateData;
}

// Function to invalidate cache when new data is imported
export function invalidateAggregateDataCache(): void {
  cachedAggregateData = null;
  lastFetchTime = 0;
}