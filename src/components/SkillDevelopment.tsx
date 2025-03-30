
import React, { useState, useEffect } from 'react';
import { Gauge, Search, Ear, BarChart, Users, TreePalm } from 'lucide-react';
import ActivityCard from './skill-development/ActivityCard';
import SavedActivityCard from './skill-development/SavedActivityCard';
import { useActivities } from '@/hooks/useActivities';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from '@/contexts/language/LanguageContext';
import { formatCategoryName } from '@/utils/formatCategory';

// Get activities from the module
import { activityData as activities } from '@/data/heartActivities';

const dimensionIcons: { [key: string]: React.FC<{ className?: string }> } = {
  intellectual: Search,
  social: Users,
  spiritual: TreePalm,
  emotional: Ear,
  physical: Gauge,
  accountability: BarChart,
  humility: Gauge,
  empathy: Ear,
  resiliency: TreePalm,
  transparency: Search,
  inclusivity: Users,
};

const SkillDevelopment: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<string>('accountability');
  const { savedActivities, loading, saveActivity, toggleActivityCompletion, removeSavedActivity } = useActivities();
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

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

  // Properly translate activities
  const getTranslatedActivities = () => {
    return activities
      .filter(activity => activity.dimension === selectedDimension)
      .map(activity => {
        // Format the category properly with the utility function
        const formattedCategory = formatCategoryName(activity.category);
        
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

  const filteredActivities = getTranslatedActivities();

  // Get proper translations for headings
  const developmentActivitiesTitle = t('results.development.title', { fallback: "Development Activities" });
  const savedActivitiesTitle = t('results.development.mySavedActivities', { fallback: "My Saved Activities" });
  const noActivitiesSavedText = t('results.development.noActivitiesSaved', { fallback: "No activities saved. Select some activities in the Development tab." });
  const loadingText = t('common.loading', { fallback: "Loading..." });

  // Adjust tab text size for languages with longer words
  const getTabStyles = () => {
    return ['zh', 'ja', 'de'].includes(currentLanguage) ? 'text-xs' : '';
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-semibold mb-6">
        {developmentActivitiesTitle}
      </h1>

      <Tabs defaultValue="accountability" className="w-full">
        <TabsList className="flex flex-wrap">
          {Object.keys(dimensionIcons).map((dimension) => (
            <TabsTrigger 
              value={dimension} 
              key={dimension} 
              onClick={() => setSelectedDimension(dimension)}
              className={getTabStyles()}
            >
              {React.createElement(dimensionIcons[dimension], { className: "mr-2 h-4 w-4" })}
              {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(dimensionIcons).map((dimension) => (
          <TabsContent value={dimension} key={dimension}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimension === selectedDimension && filteredActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  savedActivities={savedActivities}
                  onSave={handleSaveActivity}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
                const activityDetails = activities.find(activity => activity.id === savedActivity.activityId);
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
                    onToggleCompletion={toggleActivityCompletion}
                    onRemove={removeSavedActivity}
                  />
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <p>{noActivitiesSavedText}</p>
        )}
      </div>
    </div>
  );
};

export default SkillDevelopment;
