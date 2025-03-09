
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, BookmarkPlus, CheckCircle2, Clock } from 'lucide-react';
import { SkillActivity, SavedActivity, dimensionColors, dimensionTitles } from '@/data/heartActivities';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActivityCardProps {
  activity: SkillActivity;
  savedActivities: SavedActivity[];
  onSave: (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, savedActivities, onSave }) => {
  const isMobile = useIsMobile();
  const isSaved = savedActivities.some(saved => saved.activityId === activity.id);
  const savedCount = savedActivities.length;
  const maxSavedReached = savedCount >= 3;
  const [expanded, setExpanded] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const handleSave = (addToHabitTracker?: boolean) => {
    onSave(activity, addToHabitTracker, frequency);
  };

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${expanded ? 'border-primary' : ''}`}>
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Badge className={`${dimensionColors[activity.dimension]} font-normal mr-2`}>
                {dimensionTitles[activity.dimension]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {activity.category}
              </span>
            </div>
            {!isSaved && !expanded && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="px-2 py-1 h-auto"
                onClick={() => setExpanded(!expanded)}
              >
                <Plus size={16} />
              </Button>
            )}
          </div>
          <p className="text-sm">
            {activity.description}
          </p>
        </div>
        
        {isSaved ? (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center bg-green-50 text-green-700 border-green-200"
              disabled
            >
              <CheckCircle2 size={16} className="mr-1.5 text-green-600" />
              Saved
            </Button>
          </div>
        ) : expanded && (
          <div className="mt-2 space-y-3">
            <div className="bg-muted p-2 rounded-md">
              <p className="text-xs font-medium mb-2 flex items-center">
                <Clock size={14} className="mr-1" />
                Frequency:
              </p>
              <div className="flex gap-2">
                <Toggle
                  pressed={frequency === 'daily'}
                  onPressedChange={() => setFrequency('daily')}
                  className={`text-xs py-1 px-2 h-auto rounded ${frequency === 'daily' ? 'bg-blue-100 border-blue-300 text-blue-800' : ''}`}
                  size="sm"
                >
                  Daily
                </Toggle>
                <Toggle
                  pressed={frequency === 'weekly'}
                  onPressedChange={() => setFrequency('weekly')}
                  className={`text-xs py-1 px-2 h-auto rounded ${frequency === 'weekly' ? 'bg-purple-100 border-purple-300 text-purple-800' : ''}`}
                  size="sm"
                >
                  Weekly
                </Toggle>
                <Toggle
                  pressed={frequency === 'monthly'}
                  onPressedChange={() => setFrequency('monthly')}
                  className={`text-xs py-1 px-2 h-auto rounded ${frequency === 'monthly' ? 'bg-orange-100 border-orange-300 text-orange-800' : ''}`}
                  size="sm"
                >
                  Monthly
                </Toggle>
              </div>
            </div>
            
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-2'}`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center justify-center"
                onClick={() => handleSave()}
                disabled={maxSavedReached}
              >
                <BookmarkPlus size={16} className="mr-1.5" />
                Save
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center justify-center"
                onClick={() => handleSave(true)}
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
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
