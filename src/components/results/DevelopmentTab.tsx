
import React, { useState } from 'react';
import { HEARTIDimension } from '@/types';
import { activityData } from '@/data/heartActivities';
import { addActivityToHabitTracker } from '@/services/habitTrackerService';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import DimensionTabs from './development/DimensionTabs';
import InfoBanner from './development/InfoBanner';
import ActivityList from './development/ActivityList';

interface DevelopmentTabProps {
  focusDimension: HEARTIDimension;
}

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension }) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension>(focusDimension);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { toast } = useToast();
  
  // Filter activities for the active dimension
  const activities = activityData.filter(activity => activity.dimension === activeDimension);
  
  const handleSelectActivity = (activityId: string) => {
    // Toggle selection (max 3)
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
    <div className="mb-4">
      <InfoBanner focusDimension={focusDimension} />
      
      {/* HEARTI Navigation */}
      <DimensionTabs 
        activeDimension={activeDimension} 
        onDimensionChange={setActiveDimension}
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
    </div>
  );
};

export default DevelopmentTab;
