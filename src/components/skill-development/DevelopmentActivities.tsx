
import React from 'react';
import { SkillActivity } from '@/data/heartActivities';
import { SavedActivity } from '@/data/heartActivities';
import { activityData } from '@/data/heartActivities';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategory } from '@/utils/formatCategory';

interface DevelopmentActivitiesProps {
  selectedDimension: string;
}

export const useTranslatedActivities = (selectedDimension: string) => {
  const { t } = useLanguage();

  // Get translated activities for the selected dimension
  const getTranslatedActivities = () => {
    return activityData
      .filter(activity => activity.dimension === selectedDimension)
      .map(activity => {
        // Format the category properly with spaces
        const formattedCategory = formatCategory(activity.category);
        
        const categoryKey = `activities.categories.${activity.category.toLowerCase().replace(/[- ]/g, '')}`;
        const descriptionKey = `activities.descriptions.${activity.id}`;
        
        // Make sure to include fallbacks
        const translatedActivity = {
          ...activity,
          description: t(descriptionKey, { fallback: activity.description }),
          category: t(categoryKey, { fallback: formattedCategory })
        };
        
        return translatedActivity;
      });
  };

  return getTranslatedActivities();
};

export default useTranslatedActivities;
