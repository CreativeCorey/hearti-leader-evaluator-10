
import React from 'react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import ActivityCard from './ActivityCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { HEARTIDimension } from '@/types';

interface ActivityListProps {
  groupedActivities: Record<string, SkillActivity[]>;
  savedActivities: SavedActivity[];
  onSaveActivity: (activity: SkillActivity, addToHabitTracker?: boolean) => void;
  focusDimension?: HEARTIDimension;
  topStrength?: HEARTIDimension;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  groupedActivities, 
  savedActivities, 
  onSaveActivity,
  focusDimension,
  topStrength
}) => {
  const savedActivitiesCount = savedActivities.length;
  const isRecommendationVisible = savedActivitiesCount < 3;

  if (Object.entries(groupedActivities).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activities found for this dimension.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isRecommendationVisible && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            <p>We recommend selecting 3 total behaviors to track:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Select behaviors from your strength area: <strong className="uppercase">{topStrength}</strong></li>
              <li>Select behaviors from your development area: <strong className="uppercase">{focusDimension}</strong></li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {Object.entries(groupedActivities).map(([category, activities]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-medium mb-3">{category}</h3>
          <div className="grid gap-3">
            {activities.map((activity) => {
              const isStrengthArea = activity.dimension === topStrength;
              const isVulnerabilityArea = activity.dimension === focusDimension;
              
              return (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  savedActivities={savedActivities}
                  onSave={onSaveActivity}
                  isHighlighted={isStrengthArea || isVulnerabilityArea}
                  highlightType={isStrengthArea ? 'strength' : isVulnerabilityArea ? 'vulnerability' : undefined}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
