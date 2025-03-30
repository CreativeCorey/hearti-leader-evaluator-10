
import React, { useState } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { useActivities } from '@/hooks/useActivities';
import { SkillActivity } from '@/data/heartActivities';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategoryName } from '@/utils/formatCategory';

import DimensionTabs from './DimensionTabs';
import SavedActivitiesList from './SavedActivitiesList';
import { useTranslatedActivities } from './DevelopmentActivities';

const SkillDevelopment: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<string>('accountability');
  const { savedActivities, loading, saveActivity, toggleActivityCompletion, removeSavedActivity } = useActivities();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Get filtered activities for the selected dimension using our custom hook
  const filteredActivities = useTranslatedActivities(selectedDimension);
  
  // Ensure all activities have properly formatted categories
  const formattedActivities = filteredActivities.map(activity => ({
    ...activity,
    category: formatCategoryName(activity.category)
  }));

  const handleSaveActivity = (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => {
    if (savedActivities.length >= 3) {
      toast({
        title: t('results.development.tooManySaved', { fallback: "Too many activities saved" }),
        description: t('results.development.removeBeforeSaving', { fallback: "Please remove one before saving another" }),
        variant: "destructive",
      })
      return;
    }
    
    // If adding to habit tracker, show a success toast with translated message
    if (addToHabitTracker) {
      const frequencyText = t(`results.habits.${frequency}`, { fallback: frequency });
      toast({
        title: t('results.development.activityAdded', { fallback: "Activity added" }),
        description: t('results.development.activityAddedDescription', { frequency: frequencyText, fallback: `Activity has been added to your ${frequency} habit tracker` }),
      });
    }
    
    saveActivity(activity, addToHabitTracker, frequency);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-semibold mb-6">
        {t('results.development.title', { fallback: "Development Activities" })}
      </h1>

      <Tabs defaultValue="accountability" className="w-full">
        <DimensionTabs 
          selectedDimension={selectedDimension}
          setSelectedDimension={setSelectedDimension}
          filteredActivities={formattedActivities}
          savedActivities={savedActivities}
          onSaveActivity={handleSaveActivity}
        />
      </Tabs>

      <SavedActivitiesList 
        savedActivities={savedActivities}
        loading={loading}
        activities={formattedActivities}
        onToggleCompletion={toggleActivityCompletion}
        onRemove={removeSavedActivity}
      />
    </div>
  );
};

export default SkillDevelopment;
