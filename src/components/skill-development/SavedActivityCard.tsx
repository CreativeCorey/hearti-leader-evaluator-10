
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkCheck, Check, Plus } from 'lucide-react';
import { SavedActivity, SkillActivity, dimensionColors, dimensionTitles } from '@/data/heartActivities';
import { addActivityToHabitTracker } from '@/services/activityService';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';

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
  const handleAddToHabitTracker = async () => {
    try {
      const userId = getOrCreateAnonymousId();
      await addActivityToHabitTracker(userId, activityDetails);
      
      toast({
        title: "Added to Habit Tracker",
        description: "The activity has been added to your habit tracker",
      });
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
          <div className="flex items-center mb-2">
            <Badge className={`${dimensionColors[activityDetails.dimension]} font-normal mr-2`}>
              {dimensionTitles[activityDetails.dimension]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {activityDetails.category}
            </span>
          </div>
          <p className="text-sm font-medium">{activityDetails.description}</p>
        </div>
        
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
            onClick={handleAddToHabitTracker}
          >
            <Plus size={16} />
            Add to Habit Tracker
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
      </div>
    </Card>
  );
};

export default SavedActivityCard;
