
import React from 'react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import ActivityCard from './ActivityCard';

interface ActivityListProps {
  groupedActivities: Record<string, SkillActivity[]>;
  savedActivities: SavedActivity[];
  onSaveActivity: (activity: SkillActivity) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  groupedActivities, 
  savedActivities, 
  onSaveActivity 
}) => {
  if (Object.entries(groupedActivities).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No activities found for this dimension.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([category, activities]) => (
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
