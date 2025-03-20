
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Plus } from 'lucide-react';
import { SkillActivity } from '@/data/heartActivities';
import { useLanguage } from '@/contexts/language/LanguageContext';
import FrequencySelector from './FrequencySelector';

interface ActivityCardActionsProps {
  activity: SkillActivity;
  frequency: 'daily' | 'weekly' | 'monthly';
  maxSavedReached: boolean;
  onSave: (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => void;
}

const ActivityCardActions: React.FC<ActivityCardActionsProps> = ({
  activity,
  frequency,
  maxSavedReached,
  onSave
}) => {
  const { t } = useLanguage();
  const [selectedFrequency, setSelectedFrequency] = React.useState<'daily' | 'weekly' | 'monthly'>(frequency);

  const handleFrequencyChange = (newFrequency: 'daily' | 'weekly' | 'monthly') => {
    setSelectedFrequency(newFrequency);
  };

  return (
    <div className="mt-3">
      <FrequencySelector
        frequency={selectedFrequency}
        setFrequency={handleFrequencyChange}
      />
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center justify-center"
          onClick={() => onSave(activity)}
          disabled={maxSavedReached}
        >
          <BookmarkPlus size={16} className="mr-1.5" />
          {t('common.save', { fallback: "Save" })}
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center justify-center"
          onClick={() => onSave(activity, true, selectedFrequency)}
          disabled={maxSavedReached}
        >
          <Plus size={16} className="mr-1.5" />
          {t('results.development.addToHabitTracker', { fallback: "Add to Tracker" })}
        </Button>
      </div>
      
      {maxSavedReached && (
        <div className="mt-2 text-xs text-red-600">
          {t('results.development.maxActivitiesDescription', {
            fallback: "You've already selected 3 activities. Remove some to add more."
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityCardActions;
