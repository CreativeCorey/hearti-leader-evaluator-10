
import React, { useState, useEffect } from 'react';
import { HEARTIAssessment } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RadarChartDisplay from "./comparison/RadarChartDisplay";
import ComparisonAnalysis from "./comparison/ComparisonAnalysis";
import ProgressChart from "./comparison/ProgressChart";
import { userColor, comparisonColors } from "./comparison/aggregateData";
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDataForRadarChart } from '@/utils/calculations';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { getAggregateData, AggregateData, invalidateAggregateDataCache } from '@/services/aggregateDataService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface ComparisonTabProps {
  assessment: HEARTIAssessment;
  assessments?: HEARTIAssessment[];
  onSelectAssessment?: (assessment: HEARTIAssessment) => void;
}

type CompareMode = 'none' | 'average' | 'gender' | 'jobRole' | 'companySize' | 'managementLevel' | 'raceEthnicity' | 'location' | 'salary';
type GenderCompareMode = 'men' | 'women';
type JobRoleCompareMode = 'engineering' | 'management' | 'executive' | 'other';
type CompanySizeCompareMode = 'small' | 'medium' | 'large';
type ManagementLevelCompareMode = 'individual' | 'manager' | 'executive';
type RaceEthnicityCompareMode = 'white' | 'black' | 'hispanic' | 'asian' | 'other';
type LocationCompareMode = 'northAmerica' | 'europe' | 'asia' | 'other';
type SalaryCompareMode = 'under50k' | '50k-100k' | '100k-150k' | 'over150k';

// Helper function to convert dimensions to comparison format
const convertToComparisonFormat = (
  userScores: Record<string, number>,
  comparisonScores: Record<string, number> | null
) => {
  return Object.keys(userScores).map(key => ({
    dimension: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    'Your Score': userScores[key],
    Comparison: comparisonScores ? comparisonScores[key] : 0
  }));
};

const ComparisonTab: React.FC<ComparisonTabProps> = ({ 
  assessment: initialAssessment, 
  assessments = [],
  onSelectAssessment
 }) => {
  const [chartView, setChartView] = useState<'combined' | 'separate'>('combined');
  const [compareMode, setCompareMode] = useState<CompareMode>('average');
  const [genderCompareMode, setGenderCompareMode] = useState<GenderCompareMode>('women');
  const [jobRoleCompareMode, setJobRoleCompareMode] = useState<JobRoleCompareMode>('management');
  const [companySizeCompareMode, setCompanySizeCompareMode] = useState<CompanySizeCompareMode>('medium');
  const [managementLevelCompareMode, setManagementLevelCompareMode] = useState<ManagementLevelCompareMode>('manager');
  const [raceEthnicityCompareMode, setRaceEthnicityCompareMode] = useState<RaceEthnicityCompareMode>('white');
  const [locationCompareMode, setLocationCompareMode] = useState<LocationCompareMode>('northAmerica');
  const [salaryCompareMode, setSalaryCompareMode] = useState<SalaryCompareMode>('50k-100k');
  const [assessment, setAssessment] = useState<HEARTIAssessment>(initialAssessment);
  const [aggregateData, setAggregateData] = useState<AggregateData | null>(null);
  const [isLoadingAggregate, setIsLoadingAggregate] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Check if user is super admin
  const isSuperAdmin = userProfile?.role === 'super_admin';

  // Load user profile
  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);
      };
      loadProfile();
    }
  }, [user]);

  // Load aggregate data when component mounts or when compare mode changes
  useEffect(() => {
    if (compareMode !== 'none') {
      setIsLoadingAggregate(true);
      // Invalidate cache for super admins to ensure they see fresh historical data
      if (isSuperAdmin) {
        invalidateAggregateDataCache();
      }
      getAggregateData().then((data) => {
        console.log('Loaded aggregate data for compareMode:', compareMode, data);
        setAggregateData(data);
        setIsLoadingAggregate(false);
      }).catch((error) => {
        console.error('Failed to load aggregate data:', error);
        setIsLoadingAggregate(false);
      });
    }
  }, [compareMode, genderCompareMode, jobRoleCompareMode, companySizeCompareMode, managementLevelCompareMode, raceEthnicityCompareMode, locationCompareMode, salaryCompareMode, isSuperAdmin]);

  // Reset the selected assessment when the initial assessment changes
  useEffect(() => {
    setAssessment(initialAssessment);
  }, [initialAssessment]);

  // Handle selection of an assessment from the progress chart
  const handleSelectAssessment = (selectedAssessment: HEARTIAssessment) => {
    setAssessment(selectedAssessment);
    if (onSelectAssessment) {
      onSelectAssessment(selectedAssessment);
    }
  };

  // Format data for radar charts
  const chartData = formatDataForRadarChart(assessment.dimensionScores);
  
  // Get comparison data based on selection
  const getComparisonData = () => {
    if (!aggregateData) return null;
    
    let result = null;
    switch (compareMode) {
      case 'average':
        result = formatDataForRadarChart(aggregateData.averageScores);
        break;
      case 'gender':
        result = formatDataForRadarChart(aggregateData.demographics.gender[genderCompareMode]);
        break;
      case 'jobRole':
        result = formatDataForRadarChart(aggregateData.demographics.jobRole[jobRoleCompareMode]);
        break;
      case 'companySize':
        result = formatDataForRadarChart(aggregateData.demographics.companySize[companySizeCompareMode]);
        break;
      case 'managementLevel':
        result = formatDataForRadarChart(aggregateData.demographics.managementLevel[managementLevelCompareMode]);
        break;
      case 'raceEthnicity':
        result = formatDataForRadarChart(aggregateData.demographics.raceEthnicity[raceEthnicityCompareMode]);
        break;
      case 'location':
        result = formatDataForRadarChart(aggregateData.demographics.location[locationCompareMode]);
        break;
      case 'salary':
        result = formatDataForRadarChart(aggregateData.demographics.salary[salaryCompareMode]);
        break;
      default:
        result = null;
    }
    
    console.log('getComparisonData result:', { compareMode, result, genderCompareMode, jobRoleCompareMode });
    return result;
  };
  
  // Format data for combined chart
  const getCombinedComparisonScores = () => {
    if (!aggregateData) return null;
    
    switch (compareMode) {
      case 'average':
        return aggregateData.averageScores;
      case 'gender':
        return aggregateData.demographics.gender[genderCompareMode];
      case 'jobRole':
        return aggregateData.demographics.jobRole[jobRoleCompareMode];
      case 'companySize':
        return aggregateData.demographics.companySize[companySizeCompareMode];
      case 'managementLevel':
        return aggregateData.demographics.managementLevel[managementLevelCompareMode];
      case 'raceEthnicity':
        return aggregateData.demographics.raceEthnicity[raceEthnicityCompareMode];
      case 'location':
        return aggregateData.demographics.location[locationCompareMode];
      case 'salary':
        return aggregateData.demographics.salary[salaryCompareMode];
      default:
        return null;
    }
  };

  const combinedChartData = convertToComparisonFormat(
    assessment.dimensionScores,
    getCombinedComparisonScores()
  );
  
  // Get comparison label based on selection with proper translation
  const getComparisonLabel = () => {
    switch (compareMode) {
      case 'average':
        return t('results.comparison.averageLabel', { fallback: 'Global Average' });
      case 'gender':
        return `${genderCompareMode === 'men' ? 'Men' : 'Women'} Average`;
      case 'jobRole':
        return `${jobRoleCompareMode.charAt(0).toUpperCase() + jobRoleCompareMode.slice(1)} Average`;
      case 'companySize':
        return `${companySizeCompareMode.charAt(0).toUpperCase() + companySizeCompareMode.slice(1)} Company Average`;
      case 'managementLevel':
        return `${managementLevelCompareMode.charAt(0).toUpperCase() + managementLevelCompareMode.slice(1)} Level Average`;
      case 'raceEthnicity':
        return `${raceEthnicityCompareMode.charAt(0).toUpperCase() + raceEthnicityCompareMode.slice(1)} Average`;
      case 'location':
        return `${locationCompareMode === 'northAmerica' ? 'North America' : locationCompareMode.charAt(0).toUpperCase() + locationCompareMode.slice(1)} Average`;
      case 'salary':
        return `${salaryCompareMode === 'under50k' ? 'Under $50k' : 
                  salaryCompareMode === '50k-100k' ? '$50k-$100k' :
                  salaryCompareMode === '100k-150k' ? '$100k-$150k' :
                  'Over $150k'} Average`;
      default:
        return '';
    }
  };
  
  // Get color for comparison data
  const getComparisonColor = () => {
    switch (compareMode) {
      case 'average': return comparisonColors.average;
      case 'gender': return '#ec4899'; // Pink for gender
      case 'jobRole': return '#10b981'; // Green for job role
      case 'companySize': return '#f59e0b'; // Orange for company size
      case 'managementLevel': return '#ef4444'; // Red for management level
      case 'raceEthnicity': return '#8b5cf6'; // Purple for race/ethnicity
      case 'location': return '#06b6d4'; // Cyan for location
      case 'salary': return '#84cc16'; // Lime for salary
      default: return "#000000";
    }
  };
  
  // Get translated text for UI elements
  const spectaText = t('results.comparison.title', { fallback: 'HEARTI:Leader Spectra' });
  const compareText = t('results.comparison.subtitle', { fallback: 'Compare your results with global benchmarks' });
  const combinedText = t('results.comparison.combined', { fallback: 'Combined' });
  const separateText = t('results.comparison.separate', { fallback: 'Separate' });
  const noneText = t('results.comparison.noneLabel', { fallback: 'None' });
  const averageText = t('results.comparison.averageLabel', { fallback: 'Average' });
  
  return (
    <div className={`space-y-6 ${isMobile ? 'mb-12' : ''}`}>
      <Card>
        <CardContent className={`pt-6 ${isMobile ? 'px-2' : ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div>
              <h3 className="text-lg font-semibold mb-1">{spectaText}</h3>
              <p className="text-sm text-muted-foreground">{compareText}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Tabs defaultValue="combined" className="w-full sm:w-auto" onValueChange={(value) => setChartView(value as 'combined' | 'separate')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="combined">{combinedText}</TabsTrigger>
                  <TabsTrigger value="separate">{separateText}</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex flex-col gap-2">
                {/* Comparison mode selection */}
                <div className="flex flex-wrap gap-2">
                  <RadioGroup 
                    value={compareMode} 
                    className="flex flex-row flex-wrap gap-2" 
                    onValueChange={(value) => setCompareMode(value as CompareMode)}
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none" className="text-xs sm:text-sm">{noneText}</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="average" id="average" />
                      <Label htmlFor="average" className="text-xs sm:text-sm">{averageText}</Label>
                    </div>
                    {isSuperAdmin && (
                      <>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="gender" id="gender" />
                          <Label htmlFor="gender" className="text-xs sm:text-sm">Gender</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="jobRole" id="jobRole" />
                          <Label htmlFor="jobRole" className="text-xs sm:text-sm">Job Role</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="companySize" id="companySize" />
                          <Label htmlFor="companySize" className="text-xs sm:text-sm">Company Size</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="managementLevel" id="managementLevel" />
                          <Label htmlFor="managementLevel" className="text-xs sm:text-sm">Management</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="raceEthnicity" id="raceEthnicity" />
                          <Label htmlFor="raceEthnicity" className="text-xs sm:text-sm">Race/Ethnicity</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="location" id="location" />
                          <Label htmlFor="location" className="text-xs sm:text-sm">Location</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="salary" id="salary" />
                          <Label htmlFor="salary" className="text-xs sm:text-sm">Salary</Label>
                        </div>
                      </>
                    )}
                  </RadioGroup>
                </div>
                
                {/* Sub-category selectors for super admins */}
                {isSuperAdmin && (
                  <div className="flex flex-wrap gap-2">
                    {compareMode === 'gender' && (
                      <Select value={genderCompareMode} onValueChange={(value) => setGenderCompareMode(value as GenderCompareMode)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {compareMode === 'jobRole' && (
                      <Select value={jobRoleCompareMode} onValueChange={(value) => setJobRoleCompareMode(value as JobRoleCompareMode)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {compareMode === 'companySize' && (
                      <Select value={companySizeCompareMode} onValueChange={(value) => setCompanySizeCompareMode(value as CompanySizeCompareMode)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {compareMode === 'managementLevel' && (
                      <Select value={managementLevelCompareMode} onValueChange={(value) => setManagementLevelCompareMode(value as ManagementLevelCompareMode)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {compareMode === 'raceEthnicity' && (
                      <Select value={raceEthnicityCompareMode} onValueChange={(value) => setRaceEthnicityCompareMode(value as RaceEthnicityCompareMode)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="hispanic">Hispanic</SelectItem>
                          <SelectItem value="asian">Asian</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {compareMode === 'location' && (
                      <Select value={locationCompareMode} onValueChange={(value) => setLocationCompareMode(value as LocationCompareMode)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="northAmerica">North America</SelectItem>
                          <SelectItem value="europe">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {compareMode === 'salary' && (
                      <Select value={salaryCompareMode} onValueChange={(value) => setSalaryCompareMode(value as SalaryCompareMode)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under50k">Under $50k</SelectItem>
                          <SelectItem value="50k-100k">$50k-$100k</SelectItem>
                          <SelectItem value="100k-150k">$100k-$150k</SelectItem>
                          <SelectItem value="over150k">Over $150k</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <RadarChartDisplay 
              chartView={chartView}
              chartData={chartData}
              combinedChartData={combinedChartData}
              getComparisonData={getComparisonData}
              compareMode={compareMode}
              getComparisonLabel={getComparisonLabel}
              getComparisonColor={getComparisonColor}
              userColor={userColor}
            />
          </div>
          
          {compareMode !== 'none' && aggregateData && !isLoadingAggregate && (
            <ComparisonAnalysis 
              assessment={assessment}
              averageScores={getCombinedComparisonScores()} 
              comparisonLabel={getComparisonLabel()}
              comparisonColor={getComparisonColor()}
            />
          )}
          
          {compareMode !== 'none' && isLoadingAggregate && (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading comparison data...</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Progress chart at the bottom */}
      {assessments && assessments.length > 0 && (
        <div className="mt-8 mb-8">
          <ProgressChart assessments={assessments} onSelectAssessment={handleSelectAssessment} />
        </div>
      )}
    </div>
  );
};

export default ComparisonTab;
