
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Check } from 'lucide-react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import ActivityCardHeader from './ActivityCardHeader';
import ActivityCardActions from './ActivityCardActions';
import { useActivityTranslations } from '@/utils/activityTranslations';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ActivityCardProps {
  activity: SkillActivity;
  savedActivities: SavedActivity[];
  onSave: (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, savedActivities, onSave }) => {
  const [expanded, setExpanded] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { getTranslatedCategory, getTranslatedDescription } = useActivityTranslations();
  const { t } = useLanguage();
  
  const isSaved = savedActivities.some(saved => saved.activityId === activity.id);
  const maxSavedReached = savedActivities.length >= 3;
  
  // Get properly translated category and description
  const displayCategory = getTranslatedCategory(activity.category);
  const displayDescription = getTranslatedDescription(activity.id, activity.description);
  
  // Create a properly formatted activity object with translations
  const formattedActivity = {
    ...activity,
    category: displayCategory,
    description: displayDescription
  };

  return (
    <Card className={`border ${isSaved ? 'border-indigo-300 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800' : 'dark:bg-gray-900'}`}>
      <CardContent className="p-4">
        <ActivityCardHeader 
          activity={formattedActivity} 
          showExpandButton={!isSaved} 
          toggleExpanded={() => setExpanded(!expanded)}
          isSaved={isSaved}
          expanded={expanded}
        />
        
        <p className="text-sm mb-3 dark:text-gray-300">{formattedActivity.description}</p>
        
        {isSaved ? (
          <Button size="sm" className="w-full mt-2 bg-indigo-500" disabled>
            <Check className="mr-2 h-4 w-4" />
            {t('common.saved', { fallback: "Saved" })}
          </Button>
        ) : expanded ? (
          <ActivityCardActions 
            activity={activity} 
            frequency={frequency}
            onFrequencyChange={setFrequency}
            maxSavedReached={maxSavedReached}
            onSave={onSave}
          />
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 dark:text-white dark:border-gray-700 dark:hover:bg-gray-800" 
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
