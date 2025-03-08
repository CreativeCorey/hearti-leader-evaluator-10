
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { SkillActivity, SavedActivity, dimensionColors, dimensionTitles } from '@/data/heartActivities';

interface ActivityCardProps {
  activity: SkillActivity;
  savedActivities: SavedActivity[];
  onSave: (activity: SkillActivity, addToHabitTracker?: boolean) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, savedActivities, onSave }) => {
  const isSaved = savedActivities.some(saved => saved.activityId === activity.id);
  const savedCount = savedActivities.length;
  const maxSavedReached = savedCount >= 3;
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Badge className={`${dimensionColors[activity.dimension]} font-normal mr-2`}>
              {dimensionTitles[activity.dimension]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {activity.category}
            </span>
          </div>
          <p className="text-sm">
            {activity.description}
          </p>
        </div>
        
        <div className="flex gap-2 ml-auto">
          {isSaved ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center bg-green-50 text-green-700 border-green-200"
              disabled
            >
              <CheckCircle2 size={16} className="mr-1.5 text-green-600" />
              Saved
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={() => onSave(activity)}
                disabled={maxSavedReached}
              >
                <BookmarkPlus size={16} className="mr-1.5" />
                Save
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center"
                onClick={() => onSave(activity, true)}
                disabled={maxSavedReached}
              >
                <Plus size={16} className="mr-1.5" />
                Add to Tracker
              </Button>
            </>
          )}
        </div>
      </div>
      
      {!isSaved && maxSavedReached && (
        <div className="mt-2 text-xs text-red-600">
          You've already selected 3 activities. Remove some to add more.
        </div>
      )}
    </Card>
  );
};

export default ActivityCard;
