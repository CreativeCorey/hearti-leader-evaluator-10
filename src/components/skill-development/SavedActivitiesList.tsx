
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SavedActivity } from '@/data/heartActivities';
import { SkillActivity } from '@/data/heartActivities';
import SavedActivityCard from './SavedActivityCard';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategoryName } from '@/utils/formatCategory';
import { activityData } from '@/data/heartActivities';

interface SavedActivitiesListProps {
  savedActivities: SavedActivity[];
  loading: boolean;
  activities: SkillActivity[];
  onToggleCompletion: (savedActivityId: string | undefined) => void;
  onRemove: (savedActivityId: string | undefined) => void;
}

const SavedActivitiesList: React.FC<SavedActivitiesListProps> = ({
  savedActivities,
  loading,
  activities,
  onToggleCompletion,
  onRemove
}) => {
  const { t } = useLanguage();
  
  // Get proper translations for headings
  const savedActivitiesTitle = t('results.development.mySavedActivities', { fallback: "My Saved Activities" });
  const noActivitiesSavedText = t('results.development.noActivitiesSaved', { fallback: "No activities saved. Select some activities in the Development tab." });
  const loadingText = t('common.loading', { fallback: "Loading..." });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        {savedActivitiesTitle}
      </h2>
      {loading ? (
        <p>{loadingText}</p>
      ) : savedActivities.length > 0 ? (
        <ScrollArea className="h-[300px] w-full rounded-md border">
          <div className="flex flex-col gap-4 p-4">
            {savedActivities.map(savedActivity => {
              const activityDetails = activityData.find(activity => activity.id === savedActivity.activityId);
              if (!activityDetails) return null;

              // Format the category properly with our utility function
              const formattedCategory = formatCategoryName(activityDetails.category);
              
              // Translate the activity details with fallbacks
              const categoryKey = `activities.categories.${activityDetails.category.toLowerCase().replace(/[- ]/g, '')}`;
              const descriptionKey = `activities.descriptions.${activityDetails.id}`;
              
              const translatedActivity = {
                ...activityDetails,
                description: t(descriptionKey, { fallback: activityDetails.description }),
                category: t(categoryKey, { fallback: formattedCategory })
              };

              return (
                <SavedActivityCard
                  key={savedActivity.id}
                  savedActivity={savedActivity}
                  activityDetails={translatedActivity}
                  onToggleCompletion={onToggleCompletion}
                  onRemove={onRemove}
                />
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <p>{noActivitiesSavedText}</p>
      )}
    </div>
  );
};

export default SavedActivitiesList;
