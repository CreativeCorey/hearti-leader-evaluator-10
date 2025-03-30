
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SavedActivity, SkillActivity } from '@/data/heartActivities';
import { addActivityToHabitTracker } from '@/services/activityService';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import SavedActivityHeader from './SavedActivityHeader';
import SavedActivityActions from './SavedActivityActions';
import ActivityFrequencySelector from './ActivityFrequencySelector';

interface SavedActivityCardProps {
  savedActivity: SavedActivity;
  activityDetails: SkillActivity;
  onToggleCompletion: (savedActivityId: string | undefined) => void;
  onRemove: (savedActivityId: string | undefined) => void;
}

const SavedActivityCard: React.FC<SavedActivityCardProps> = ({ 
  savedActivity, 
  activityDetails, 
  onToggleCompletion, 
  onRemove 
}) => {
  const isMobile = useIsMobile();
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showFrequency, setShowFrequency] = useState(false);
  
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

  return (
    <Card className={`p-4 border-l-4 ${savedActivity.completed ? 'border-l-green-500 bg-green-50' : 'border-l-blue-300'}`}>
      <div className="flex flex-col gap-3">
        <div>
          <SavedActivityHeader 
            dimension={activityDetails.dimension} 
            category={activityDetails.category} 
          />
          <p className="text-sm font-medium">{activityDetails.description}</p>
        </div>
        
        {showFrequency ? (
          <ActivityFrequencySelector
            frequency={frequency}
            setFrequency={setFrequency}
            onCancel={() => setShowFrequency(false)}
            onConfirm={handleAddToHabitTracker}
          />
        ) : (
          <SavedActivityActions
            isCompleted={savedActivity.completed}
            onToggleCompletion={handleToggleCompletion}
            onShowFrequencySelector={() => setShowFrequency(true)}
            onRemove={handleRemove}
          />
        )}
      </div>
    </Card>
  );
};

export default SavedActivityCard;
