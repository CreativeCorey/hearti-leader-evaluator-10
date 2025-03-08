
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { SkillActivity, SavedActivity, dimensionColors, dimensionTitles } from '@/data/heartActivities';

interface ActivityCardProps {
  activity: SkillActivity;
  savedActivities: SavedActivity[];
  onSave: (activity: SkillActivity, addToHabitTracker?: boolean) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, savedActivities, onSave }) => {
  const isAlreadySaved = savedActivities.some(saved => saved.activityId === activity.id);
  
  return (
    <Card className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Badge className={`${dimensionColors[activity.dimension]} font-normal mr-2`}>
              {dimensionTitles[activity.dimension]}
            </Badge>
          </div>
          <p className="text-sm">{activity.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2 flex items-center gap-1" 
            onClick={() => onSave(activity, false)}
            disabled={isAlreadySaved}
          >
            <Bookmark size={16} />
            {isAlreadySaved ? 'Saved' : 'Save'}
          </Button>
          {!isAlreadySaved && (
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 text-xs" 
              onClick={() => onSave(activity, true)}
            >
              Save & Track
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
