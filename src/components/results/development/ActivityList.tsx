
import React from 'react';
import { HEARTIDimension } from '@/types';
import { dimensionIcons, dimensionLabels } from './DimensionIcons';
import ActivityCard from './ActivityCard';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategoryName } from '@/utils/formatCategory';

interface ActivityListProps {
  activeDimension: HEARTIDimension;
  activities: Array<{
    id: string;
    dimension: string;
    category: string;
    description: string;
  }>;
  selectedActivities: string[];
  selectedFrequency: 'daily' | 'weekly' | 'monthly';
  onActivitySelect: (activityId: string) => void;
  onFrequencyChange: (frequency: 'daily' | 'weekly' | 'monthly') => void;
  onAddToHabitTracker: (activityId: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activeDimension,
  activities,
  selectedActivities,
  selectedFrequency,
  onActivitySelect,
  onFrequencyChange,
  onAddToHabitTracker
}) => {
  const { t } = useLanguage();
  const DimensionIcon = dimensionIcons[activeDimension] || dimensionIcons.humility;
  
  // Get all translated strings with fallbacks
  const chooseActivitiesText = t('results.development.chooseActivitiesFor', { 
    fallback: "Choose Activities For" 
  });
  
  // Format title correctly with dimension
  const dimensionName = t(`dimensions.titles.${activeDimension}`, { 
    fallback: activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1) 
  });
  
  const activitiesTitle = `${chooseActivitiesText}: ${dimensionName}`;
  
  // Create a proper description with fallback
  const activitiesDescription = t('results.development.activitiesDescription', { 
    dimension: dimensionName,
    fallback: `These activities are designed to help you develop your ${dimensionName} leadership dimension. Select up to 3 activities to focus on.`
  });
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <DimensionIcon className="text-indigo-600 dark:text-indigo-400" size={24} />
        {activitiesTitle}
      </h3>
      <p className="text-muted-foreground dark:text-gray-300 mb-6">
        {activitiesDescription}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.slice(0, 9).map(activity => {
          const isSelected = selectedActivities.includes(activity.id);
          
          // Always properly format category with Title Case
          const formattedCategory = formatCategoryName(activity.category);
          
          // Create proper category key with appropriate fallback
          const categoryKey = `activities.categories.${activity.category.toLowerCase().replace(/[- &]/g, '')}`;
          // Create proper description key with fallback
          const descriptionKey = `activities.descriptions.${activity.id}`;
          
          // Get translated category and description with fallbacks
          const translatedCategory = t(categoryKey, { fallback: formattedCategory });
          const translatedDescription = t(descriptionKey, { fallback: activity.description });
          
          return (
            <ActivityCard
              key={activity.id}
              activity={{
                ...activity,
                category: translatedCategory,
                description: translatedDescription
              }}
              isSelected={isSelected}
              selectedFrequency={selectedFrequency}
              onActivitySelect={onActivitySelect}
              onFrequencyChange={onFrequencyChange}
              onAddToHabitTracker={onAddToHabitTracker}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActivityList;
