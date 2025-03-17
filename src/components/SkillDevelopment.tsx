
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
        title: t('results.development.tooManySaved'),
        description: t('results.development.removeBeforeSaving'),
        variant: "destructive",
      })
      return;
    }
    saveActivity(activity, addToHabitTracker, frequency);
  };

  // Filter activities by selected dimension
  const filteredActivities = activities
    .filter(activity => activity.dimension === selectedDimension)
    .map(activity => ({
      ...activity,
      // Ensure descriptions are properly translated
      description: t(`activities.descriptions.${activity.id}`, { fallback: activity.description }),
      category: t(`activities.categories.${activity.category.toLowerCase().replace(/[- ]/g, '')}`, { fallback: activity.category })
    }));

  // Adjust tab text size for languages with longer words
  const getTabStyles = () => {
    return ['zh', 'ja', 'de'].includes(currentLanguage) ? 'text-xs' : '';
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-semibold mb-6">{t('results.development.title')}</h1>

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
              {dimension}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(dimensionIcons).map((dimension) => (
          <TabsContent value={dimension} key={dimension}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActivities.map(activity => (
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
        <h2 className="text-2xl font-semibold mb-4">{t('results.development.mySavedActivities')}</h2>
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : savedActivities.length > 0 ? (
          <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="flex flex-col gap-4 p-4">
              {savedActivities.map(savedActivity => {
                const activityDetails = activities.find(activity => activity.id === savedActivity.activityId);
                if (!activityDetails) return null;

                // Translate the activity details
                const translatedActivity = {
                  ...activityDetails,
                  description: t(`activities.descriptions.${activityDetails.id}`, { fallback: activityDetails.description }),
                  category: t(`activities.categories.${activityDetails.category.toLowerCase().replace(/[- ]/g, '')}`, { fallback: activityDetails.category })
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
          <p>{t('results.development.noActivitiesSaved')}</p>
        )}
      </div>
    </div>
  );
};

export default SkillDevelopment;
