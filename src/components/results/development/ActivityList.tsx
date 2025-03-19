
import React from 'react';
import { HEARTIDimension } from '@/types';
import { dimensionIcons, dimensionLabels } from './DimensionIcons';
import ActivityCard from './ActivityCard';
import { useLanguage } from '@/contexts/language/LanguageContext';

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
  const activitiesTitle = `${chooseActivitiesText}: ${activeDimension}`;
  
  // Create a proper description with fallback
  const activitiesDescription = t('results.development.activitiesDescription', { 
    dimension: activeDimension,
    fallback: `These activities are designed to help you develop your ${activeDimension} leadership dimension. Select up to 3 activities to focus on.`
  });
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <DimensionIcon className="text-indigo-600" size={24} />
        {activitiesTitle}
      </h3>
      <p className="text-muted-foreground mb-6">
        {activitiesDescription}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.slice(0, 9).map(activity => {
          const isSelected = selectedActivities.includes(activity.id);
          
          // Format the category properly with spaces
          let formattedCategory = activity.category;
          if (activity.category.match(/[a-z][A-Z]/)) {
            formattedCategory = activity.category
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/^[a-z]/, match => match.toUpperCase());
          }
          
          // Create proper category key with appropriate fallback
          const categoryKey = `activities.categories.${activity.category.toLowerCase().replace(/[- ]/g, '')}`;
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
