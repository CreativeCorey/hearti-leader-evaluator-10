import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, BookmarkPlus, CheckCircle2, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { SkillActivity, SavedActivity, dimensionColors, dimensionTitles } from '@/data/heartActivities';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeable } from 'react-swipeable';

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
  const [swipeState, setSwipeState] = useState<'default' | 'swiping-save' | 'swiping-tracker' | 'saved'>('default');
  
  const handleSave = (addToHabitTracker?: boolean) => {
    onSave(activity, addToHabitTracker, frequency);
    setSwipeState('saved');
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isSaved && !maxSavedReached) {
        handleSave(true); // Add to tracker
      }
    },
    onSwipedRight: () => {
      if (!isSaved && !maxSavedReached) {
        handleSave(); // Save only
      }
    },
    onSwiping: (event) => {
      if (isSaved || maxSavedReached) return;
      
      if (event.dir === 'Left' && Math.abs(event.deltaX) > 40) {
        setSwipeState('swiping-tracker');
      } else if (event.dir === 'Right' && Math.abs(event.deltaX) > 40) {
        setSwipeState('swiping-save');
      } else {
        setSwipeState('default');
      }
    },
    onSwiped: () => {
      if (swipeState !== 'saved') {
        setSwipeState('default');
      }
    },
    trackMouse: false
  });

  const getSwipeIndicatorStyles = () => {
    switch (swipeState) {
      case 'swiping-save':
        return 'bg-blue-50 border-blue-200';
      case 'swiping-tracker':
        return 'bg-green-50 border-green-200';
      case 'saved':
        return 'bg-green-50 border-green-200';
      default:
        return '';
    }
  };

  return (
    <Card 
      className={`p-4 hover:shadow-md transition-shadow relative overflow-hidden ${expanded ? 'border-primary' : ''} ${getSwipeIndicatorStyles()}`}
      {...swipeHandlers}
    >
      {!isSaved && isMobile && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 opacity-30">
          <div className={`${swipeState === 'swiping-save' ? 'opacity-100' : 'opacity-30'}`}>
            <ArrowRight className="h-6 w-6 text-blue-500" />
            <span className="text-xs">Save</span>
          </div>
          <div className={`${swipeState === 'swiping-tracker' ? 'opacity-100' : 'opacity-30'}`}>
            <ArrowLeft className="h-6 w-6 text-green-500" />
            <span className="text-xs">Add to Tracker</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-3 relative z-10">
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
            {!isSaved && !expanded && !isMobile && (
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
        ) : expanded && !isMobile ? (
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
            
            <div className="grid grid-cols-2 gap-2">
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
        ) : isMobile && (
          <div className="text-xs text-muted-foreground text-center italic mt-1">
            Swipe right to save or left to add to tracker
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
