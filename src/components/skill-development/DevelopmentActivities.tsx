
import React from 'react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import { activityData } from '@/data/heartActivities';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategoryName } from '@/utils/formatCategory';

interface DevelopmentActivitiesProps {
  selectedDimension: string;
}

const DevelopmentActivities: React.FC<DevelopmentActivitiesProps> = ({ selectedDimension }) => {
  const translatedActivities = useTranslatedActivities(selectedDimension);
  
  return (
    <div className="development-activities">
      {/* Your activities display code */}
      {/* This component should display the activities for the selected dimension */}
    </div>
  );
};

export const useTranslatedActivities = (selectedDimension: string) => {
  const { t } = useLanguage();

  // Get translated activities for the selected dimension
  const getTranslatedActivities = () => {
    return activityData
      .filter(activity => activity.dimension === selectedDimension)
      .map(activity => {
        // Always format the category properly with spaces and title case
        const formattedCategory = formatCategoryName(activity.category);
        
        // Create translation keys based on activity ID and category
        const lowerCaseCategory = activity.category?.toLowerCase().replace(/[-_\s&]/g, '') || '';
        const categoryKey = `activities.categories.${lowerCaseCategory}`;
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

export default DevelopmentActivities;
