
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkCheck, Check } from 'lucide-react';
import { SavedActivity, SkillActivity, dimensionColors, dimensionTitles } from '@/data/heartActivities';

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
  return (
    <Card className={`p-4 border-l-4 ${savedActivity.completed ? 'border-l-green-500 bg-green-50' : 'border-l-blue-300'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Badge className={`${dimensionColors[activityDetails.dimension]} font-normal mr-2`}>
              {dimensionTitles[activityDetails.dimension]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {activityDetails.category}
            </span>
          </div>
          <p className="text-sm">{activityDetails.description}</p>
        </div>
        <div className="flex gap-1">
          <Button 
            variant={savedActivity.completed ? "outline" : "default"}
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => onToggleCompletion(savedActivity.id)}
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
            variant="ghost" 
            size="sm"
            onClick={() => onRemove(savedActivity.id)}
          >
            <BookmarkCheck size={16} className="text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SavedActivityCard;
