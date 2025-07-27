
import React from 'react';
import { SkillActivity } from '@/data/heartActivities';
import { activityData } from '@/data/heartActivities';
import { useActivityTranslations } from '@/utils/activityTranslations';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DevelopmentActivitiesProps {
  selectedDimension: string;
}

// The custom hook to get translated activities for a dimension
export const useTranslatedActivities = (selectedDimension: string): SkillActivity[] => {
  const { t } = useLanguage();
  const { getTranslatedCategory, getTranslatedDescription } = useActivityTranslations();

  // Get translated activities for the selected dimension
  const getTranslatedActivities = () => {
    return activityData
      .filter(activity => activity.dimension === selectedDimension)
      .map(activity => {
        // Create translation keys based on activity ID and category
        // Get properly translated category and description
        const formattedCategory = getTranslatedCategory(activity.category);
        const formattedDescription = getTranslatedDescription(activity.id, activity.description);
        
        return {
          ...activity,
          category: formattedCategory,
          description: formattedDescription
        };
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
            <h3 className="text-base font-medium">{activity.category}</h3>
            <p>{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentActivities;
