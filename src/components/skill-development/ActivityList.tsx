
import React from 'react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import ActivityCard from './ActivityCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SwipeInstructions from './SwipeInstructions';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategoryName } from '@/utils/formatCategory';

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
  const { t } = useLanguage();

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
            {t('results.development.recommendation', {
              fallback: "We recommend selecting at least 3 behaviors to track - choose ones that address both your strengths and vulnerability areas."
            })}
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
