
import React from 'react';
import { HEARTIDimension } from '@/types';
import { addActivityToHabitTracker } from '@/services/habitTrackerService';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { activityData } from '@/data/heartActivities';
import ActivityList from './ActivityList';
import DevelopmentFrequencySelector from './DevelopmentFrequencySelector';
import ActivitiesToggleButton from './ActivitiesToggleButton';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface ActivitySectionProps {
  activeDimension: HEARTIDimension;
  showActivities: boolean;
  toggleActivities: () => void;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  activeDimension,
  showActivities,
  toggleActivities
}) => {
  const [selectedActivities, setSelectedActivities] = React.useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = React.useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const activities = activityData.filter(activity => activity.dimension === activeDimension);
  
  const handleSelectActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(prev => prev.filter(id => id !== activityId));
    } else if (selectedActivities.length < 3) {
      setSelectedActivities(prev => [...prev, activityId]);
    } else {
      toast({
        title: t('results.development.maxActivities'),
        description: t('results.development.maxActivitiesDescription'),
        variant: "destructive",
      });
    }
  };
  
  const handleAddToHabitTracker = (activityId: string) => {
    const activity = activityData.find(a => a.id === activityId);
    if (!activity) return;
    
    const userId = getOrCreateAnonymousId();
    addActivityToHabitTracker(userId, activity, selectedFrequency);
    
    toast({
      title: t('results.development.activityAdded'),
      description: t('results.development.activityAddedDescription', { 
        frequency: t(`results.habits.${selectedFrequency.toLowerCase()}`) 
      }),
    });
  };
  
  return (
    <>
      <ActivitiesToggleButton 
        showActivities={showActivities} 
        onToggle={toggleActivities} 
      />
      
      {showActivities && (
        <>
          <DevelopmentFrequencySelector 
            selectedFrequency={selectedFrequency}
            onFrequencyChange={setSelectedFrequency}
          />
          
          <ActivityList
            activeDimension={activeDimension}
            activities={activities}
            selectedActivities={selectedActivities}
            selectedFrequency={selectedFrequency}
            onActivitySelect={handleSelectActivity}
            onFrequencyChange={setSelectedFrequency}
            onAddToHabitTracker={handleAddToHabitTracker}
          />
        </>
      )}
    </>
  );
};

export default ActivitySection;
