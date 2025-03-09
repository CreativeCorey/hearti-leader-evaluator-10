
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Plus } from 'lucide-react';
import { SkillActivity } from '@/data/heartActivities';

interface ActivityCardActionsProps {
  activity: SkillActivity;
  frequency: 'daily' | 'weekly' | 'monthly';
  maxSavedReached: boolean;
  onSave: (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => void;
}

const ActivityCardActions: React.FC<ActivityCardActionsProps> = ({
  activity,
  frequency,
  maxSavedReached,
  onSave
}) => {
  return (
    <div className="mt-3">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center"
          onClick={() => onSave(activity)}
          disabled={maxSavedReached}
        >
          <BookmarkPlus size={16} className="mr-1.5" />
          Save
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center justify-center"
          onClick={() => onSave(activity, true, frequency)}
          disabled={maxSavedReached}
        >
          <Plus size={16} className="mr-1.5" />
          Add to Tracker
        </Button>
      </div>
      
      {maxSavedReached && (
        <div className="mt-2 text-xs text-red-600">
          You've already selected 3 activities. Remove some to add more.
        </div>
      )}
    </div>
  );
};

export default ActivityCardActions;
