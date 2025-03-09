import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkCheck, Check, Plus, Clock, Calendar } from 'lucide-react';
import { SavedActivity, SkillActivity, dimensionColors, dimensionTitles } from '@/data/heartActivities';
import { addActivityToHabitTracker } from '@/services/activityService';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';
import { Toggle } from '@/components/ui/toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Gauge, Ear, ChartNoAxesCombined, TreePalm, Search, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface SavedActivityCardProps {
  savedActivity: SavedActivity;
  activityDetails: SkillActivity;
  onToggleCompletion: (savedActivityId: string | undefined) => void;
  onRemove: (savedActivityId: string | undefined) => void;
}

const dimensionIcons: Record<string, LucideIcon> = {
  humility: Gauge,
  empathy: Ear,
  accountability: ChartNoAxesCombined,
  resiliency: TreePalm,
  transparency: Search,
  inclusivity: Users
};

const SavedActivityCard: React.FC<SavedActivityCardProps> = ({ 
  savedActivity, 
  activityDetails, 
  onToggleCompletion, 
  onRemove 
}) => {
  const isMobile = useIsMobile();
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showFrequency, setShowFrequency] = useState(false);
  
  const DimensionIcon = dimensionIcons[activityDetails.dimension] || Gauge;
  
  const handleAddToHabitTracker = async () => {
    try {
      const userId = getOrCreateAnonymousId();
      await addActivityToHabitTracker(userId, activityDetails, frequency);
      
      toast({
        title: "Added to Habit Tracker",
        description: `The activity has been added to your habit tracker (${frequency})`,
      });
      
      setShowFrequency(false);
    } catch (error) {
      console.error('Error adding to habit tracker:', error);
      toast({
        title: "Error",
        description: "Could not add to habit tracker",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleCompletion = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleCompletion(savedActivity.id);
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(savedActivity.id);
  };

  const renderFrequencySelector = () => (
    <div className="mt-2 bg-muted p-2 rounded-md">
      <p className="text-xs font-medium mb-2 flex items-center">
        <Clock size={14} className="mr-1" />
        Select Frequency:
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
      
      <div className="mt-2 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs py-1 px-2 h-auto"
          onClick={() => setShowFrequency(false)}
        >
          Cancel
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="text-xs py-1 px-2 h-auto"
          onClick={handleAddToHabitTracker}
        >
          Add to Tracker
        </Button>
      </div>
    </div>
  );
  
  return (
    <Card className={`p-4 border-l-4 ${savedActivity.completed ? 'border-l-green-500 bg-green-50' : 'border-l-blue-300'}`}>
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex items-center mb-2">
            <Badge className={`${dimensionColors[activityDetails.dimension]} font-normal mr-2 flex items-center gap-1`}>
              <DimensionIcon size={14} />
              {dimensionTitles[activityDetails.dimension]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {activityDetails.category}
            </span>
          </div>
          <p className="text-sm font-medium">{activityDetails.description}</p>
        </div>
        
        {showFrequency ? (
          renderFrequencySelector()
        ) : (
          <div className="flex flex-wrap gap-2 mt-1">
            <Button 
              variant={savedActivity.completed ? "outline" : "default"}
              size="sm" 
              className="flex items-center gap-1" 
              onClick={handleToggleCompletion}
            >
              {savedActivity.completed ? (
                <>
                  <Check size={16} className="text-green-600" />
                  Completed
                </>
              ) : (
                'Mark Complete'
              )}
            </Button>
            
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowFrequency(true)}
            >
              <Calendar size={16} />
              Add to Tracker
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <BookmarkCheck size={16} className="mr-1" />
              Remove
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SavedActivityCard;
