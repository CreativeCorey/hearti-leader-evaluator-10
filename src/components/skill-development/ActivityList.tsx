
import React from 'react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import ActivityCard from './ActivityCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SwipeInstructions from './SwipeInstructions';

interface ActivityListProps {
  groupedActivities: Record<string, SkillActivity[]>;
  savedActivities: SavedActivity[];
  onSaveActivity: (activity: SkillActivity, addToHabitTracker?: boolean) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  groupedActivities, 
  savedActivities, 
  onSaveActivity 
}) => {
  const savedActivitiesCount = savedActivities.length;
  const isRecommendationVisible = savedActivitiesCount < 3;
  const isMobile = useIsMobile();

  // Enhanced function to format category names with spaces for all possible cases
  const formatCategoryName = (category: string): string => {
    // First, handle camelCase by inserting spaces before capital letters
    let formatted = category.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Replace special characters with spaces and handle ampersands
    formatted = formatted.replace(/([a-z])&([a-z])/gi, '$1 & $2');
    
    // Handle all specific keyword cases that need spaces
    formatted = formatted
      .replace(/selfreflection/i, 'Self Reflection')
      .replace(/mindsetshifts/i, 'Mindset Shifts')
      .replace(/stressmanagement/i, 'Stress Management')
      .replace(/trackingprogress/i, 'Tracking Progress')
      .replace(/opencommunication/i, 'Open Communication')
      .replace(/buildingawareness/i, 'Building Awareness')
      .replace(/emotionalawareness/i, 'Emotional Awareness')
      .replace(/emotionalregulation/i, 'Emotional Regulation')
      .replace(/buildingconnections/i, 'Building Connections')
      .replace(/selfreflectionawareness/i, 'Self Reflection & Awareness')
      .replace(/problemsolvingskills/i, 'Problem Solving Skills')
      .replace(/supportsystemscommunity/i, 'Support Systems & Community')
      .replace(/settingclearexpectations/i, 'Setting Clear Expectations')
      .replace(/takingownership/i, 'Taking Ownership')
      .replace(/creatingsafespaces/i, 'Creating Safe Spaces')
      .replace(/promotingequity/i, 'Promoting Equity')
      .replace(/fosteringcollaboration/i, 'Fostering Collaboration')
      .replace(/leadingbyexample/i, 'Leading By Example')
      .replace(/sharinginformation/i, 'Sharing Information')
      .replace(/empoweringothers/i, 'Empowering Others')
      .replace(/continuousimprovement/i, 'Continuous Improvement')
      .replace(/buildingtrust/i, 'Building Trust')
      .replace(/acknowledgingothers/i, 'Acknowledging Others')
      .replace(/activelistening/i, 'Active Listening');
    
    // Handle specific cases to give better names
    const specialCases: Record<string, string> = {
      'Setting Clear Expectations': 'Expectation Setting',
      'Taking Ownership': 'Taking Ownership',
      'Problem Solving Skills': 'Problem Solving',
      'Support Systems & Community': 'Support Systems',
      'Building Awareness': 'Building Awareness',
      'Creating Safe Spaces': 'Creating Safe Spaces',
      'Promoting Equity': 'Promoting Equity',
      'Leading By Example': 'Leading By Example',
      'Self Reflection & Awareness': 'Self Reflection & Awareness',
      'Perspective Taking': 'Perspective Taking',
      'Emotional Awareness': 'Emotional Awareness',
      'Continuous Improvement': 'Continuous Improvement',
      'Open Communication': 'Open Communication',
      'Sharing Information': 'Sharing Information',
      'Fostering Collaboration': 'Fostering Collaboration'
    };
    
    // Check if we have a special case for this category
    for (const [original, replacement] of Object.entries(specialCases)) {
      if (formatted.toLowerCase() === original.toLowerCase()) {
        return replacement;
      }
    }
    
    // For categories without special case, just capitalize first letter of each word
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (Object.entries(groupedActivities).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activities found for this dimension.</p>
      </div>
    );
  }

  // Format category names in the grouped activities
  const formattedActivities: Record<string, SkillActivity[]> = {};
  
  Object.entries(groupedActivities).forEach(([category, activities]) => {
    const formattedCategory = formatCategoryName(category);
    formattedActivities[formattedCategory] = activities;
  });

  return (
    <div className="space-y-6">
      {isRecommendationVisible && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            We recommend selecting at least 3 behaviors to track - choose ones that address both your strengths and vulnerability areas.
          </AlertDescription>
        </Alert>
      )}
      
      {isMobile && <SwipeInstructions />}
      
      {Object.entries(formattedActivities).map(([category, activities]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-medium mb-3">{category}</h3>
          <div className="grid gap-3">
            {activities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                savedActivities={savedActivities}
                onSave={onSaveActivity}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
