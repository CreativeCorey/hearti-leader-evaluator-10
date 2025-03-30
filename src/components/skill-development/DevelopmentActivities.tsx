
import React from 'react';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import { activityData } from '@/data/heartActivities';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategoryName } from '@/utils/formatCategory';

interface DevelopmentActivitiesProps {
  selectedDimension: string;
}

// The custom hook to get translated activities for a dimension
export const useTranslatedActivities = (selectedDimension: string): SkillActivity[] => {
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

const DevelopmentActivities: React.FC<DevelopmentActivitiesProps> = ({ selectedDimension }) => {
  const translatedActivities = useTranslatedActivities(selectedDimension);
  
  return (
    <div className="development-activities">
      {/* This component displays the activities for the selected dimension */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {translatedActivities.map(activity => (
          <div key={activity.id} className="activity-card">
            <h3>{activity.category}</h3>
            <p>{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentActivities;
