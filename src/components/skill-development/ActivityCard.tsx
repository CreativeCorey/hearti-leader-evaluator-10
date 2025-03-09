
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeable } from 'react-swipeable';
import ActivityCardHeader from './ActivityCardHeader';
import FrequencySelector from './FrequencySelector';
import ActivityCardActions from './ActivityCardActions';
import SwipeIndicator from './SwipeIndicator';

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
      <SwipeIndicator 
        isMobile={isMobile} 
        isSaved={isSaved} 
        swipeState={swipeState} 
      />
      
      <div className="flex flex-col gap-3 relative z-10">
        <div>
          <ActivityCardHeader 
            activity={activity} 
            showExpandButton={!isSaved && !expanded && !isMobile}
            toggleExpanded={() => setExpanded(!expanded)}
          />
          
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
            <FrequencySelector 
              frequency={frequency} 
              setFrequency={setFrequency} 
            />
            
            <ActivityCardActions 
              activity={activity}
              frequency={frequency}
              maxSavedReached={maxSavedReached}
              onSave={onSave}
            />
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
