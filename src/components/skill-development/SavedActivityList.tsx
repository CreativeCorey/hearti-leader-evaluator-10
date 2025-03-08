
import React from 'react';
import { Award } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedActivity, activityData } from '@/data/heartActivities';
import SavedActivityCard from './SavedActivityCard';

interface SavedActivityListProps {
  filteredSavedActivities: SavedActivity[];
  loading: boolean;
  onToggleCompletion: (savedActivityId: string | undefined) => void;
  onRemove: (savedActivityId: string | undefined) => void;
}

const SavedActivityList: React.FC<SavedActivityListProps> = ({ 
  filteredSavedActivities, 
  loading, 
  onToggleCompletion, 
  onRemove 
}) => {
  // Find the full activity details for a saved activity by ID
  const getActivityDetails = (activityId: string) => {
    return activityData.find(activity => activity.id === activityId);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-2">Loading your saved activities...</p>
      </div>
    );
  }

  if (filteredSavedActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No saved activities found. Explore and save activities to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Award size={20} className="text-indigo-600" />
        Your Saved Activities
      </h3>
      
      <div className="bg-amber-50 p-3 rounded-md border border-amber-100 mb-2">
        <p className="text-sm text-amber-800">
          These are your saved activities. To add them to your habit tracker, use the "Add to Habit Tracker" option when viewing your saved activities.
        </p>
      </div>
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {filteredSavedActivities.map((savedActivity) => {
            const activityDetails = getActivityDetails(savedActivity.activityId);
            if (!activityDetails) return null;
            
            return (
              <SavedActivityCard
                key={savedActivity.id || `activity-${savedActivity.activityId}`}
                savedActivity={savedActivity}
                activityDetails={activityDetails}
                onToggleCompletion={onToggleCompletion}
                onRemove={onRemove}
              />
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SavedActivityList;
