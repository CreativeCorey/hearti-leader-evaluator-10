
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
  
  // Fix for the chooseActivitiesFor translation key
  const getChooseActivitiesForText = () => {
    return `${t('results.development.chooseActivitiesFor')}: ${activeDimension}`;
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <DimensionIcon className="text-indigo-600" size={24} />
        {getChooseActivitiesForText()}
      </h3>
      <p className="text-muted-foreground mb-6">
        {t('results.development.activitiesDescription', { dimension: activeDimension })}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.slice(0, 9).map(activity => {
          const isSelected = selectedActivities.includes(activity.id);
          
          return (
            <ActivityCard
              key={activity.id}
              activity={{
                ...activity,
                // Translate category and description
                category: t(`activities.categories.${activity.category.toLowerCase().replace(/[- ]/g, '')}`, { fallback: activity.category }),
                description: t(`activities.descriptions.${activity.id}`, { fallback: activity.description })
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
