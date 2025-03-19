
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import ActivityCardHeader from './ActivityCardHeader';
import ActivityCardActions from './ActivityCardActions';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ActivityCardProps {
  activity: SkillActivity;
  savedActivities: SavedActivity[];
  onSave: (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, savedActivities, onSave }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  
  const isSaved = savedActivities.some(saved => saved.activityId === activity.id);
  
  // Get the properly translated activity description
  const descriptionKey = `activities.descriptions.${activity.id}`;
  const translatedDescription = t(descriptionKey, { fallback: activity.description });
  
  return (
    <Card className={`border ${isSaved ? 'border-indigo-300 bg-indigo-50' : ''}`}>
      <CardContent className="p-4">
        <ActivityCardHeader 
          activity={activity} 
          showExpandButton={!isSaved} 
          toggleExpanded={() => setExpanded(!expanded)}
        />
        
        <p className="text-sm mb-3">{translatedDescription}</p>
        
        {isSaved ? (
          <Button size="sm" className="w-full mt-2 bg-indigo-500" disabled>
            <Check className="mr-2 h-4 w-4" />
            {t('common.saved', { fallback: "Saved" })}
          </Button>
        ) : expanded ? (
          <ActivityCardActions 
            activity={activity} 
            onSave={onSave} 
            onCancel={() => setExpanded(false)}
          />
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2" 
            onClick={() => setExpanded(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('common.save', { fallback: "Save" })}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
