
import React from 'react';
import { HEARTIDimension } from '@/types';
import { addActivityToHabitTracker } from '@/services/habitTrackerService';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { activityData } from '@/data/heartActivities';
import ActivityList from './ActivityList';
import DevelopmentFrequencySelector from './DevelopmentFrequencySelector';
import ActivitiesToggleButton from './ActivitiesToggleButton';

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
  
  const activities = activityData.filter(activity => activity.dimension === activeDimension);
  
  const handleSelectActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(prev => prev.filter(id => id !== activityId));
    } else if (selectedActivities.length < 3) {
      setSelectedActivities(prev => [...prev, activityId]);
    } else {
      toast({
        title: "Maximum activities selected",
        description: "You can only select up to 3 activities. Deselect one before adding another.",
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
      title: "Added to Habit Tracker",
      description: `This activity has been added to your ${selectedFrequency} habits. Go to the Habits tab to track your progress.`,
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
