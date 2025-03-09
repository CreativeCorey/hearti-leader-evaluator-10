
import React, { useState, useEffect } from 'react';
import { Gauge, Search, Ear, BarChart, Users, TreeDeciduous } from 'lucide-react';
import ActivityCard from './skill-development/ActivityCard';
import SavedActivityCard from './skill-development/SavedActivityCard';
import { useActivities } from '@/hooks/useActivities';
import { SkillActivity, SavedActivity } from '@/data/heartActivities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

// Get activities from the module
import { activityData as activities } from '@/data/heartActivities';

const dimensionIcons: { [key: string]: React.FC<{ className?: string }> } = {
  intellectual: Search,
  social: Users,
  spiritual: TreeDeciduous,
  emotional: Ear,
  physical: Gauge,
  accountability: BarChart,
  humility: Gauge,
  empathy: Ear,
  resiliency: TreeDeciduous,
  transparency: Search,
  inclusivity: Users,
};

const SkillDevelopment: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<string>('accountability');
  const { savedActivities, loading, saveActivity, toggleActivityCompletion, removeSavedActivity } = useActivities();
  const { toast } = useToast()

  const handleSaveActivity = (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => {
    if (savedActivities.length >= 3) {
      toast({
        title: "Too many saved activities",
        description: "You can only save up to 3 activities. Please remove one before saving another.",
        variant: "destructive",
      })
      return;
    }
    saveActivity(activity, addToHabitTracker, frequency);
  };

  const filteredActivities = activities.filter(activity => activity.dimension === selectedDimension);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-semibold mb-6">Skill Development</h1>

      <Tabs defaultValue="accountability" className="w-full">
        <TabsList>
          {Object.keys(dimensionIcons).map((dimension) => (
            <TabsTrigger value={dimension} key={dimension} onClick={() => setSelectedDimension(dimension)}>
              {React.createElement(dimensionIcons[dimension], { className: "mr-2 h-4 w-4" })}
              {dimension.charAt(0).toUpperCase() + dimension.slice(1)}
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
        <h2 className="text-2xl font-semibold mb-4">My Saved Activities</h2>
        {loading ? (
          <p>Loading saved activities...</p>
        ) : savedActivities.length > 0 ? (
          <ScrollArea className="h-[300px] w-full rounded-md border">
            <div className="flex flex-col gap-4 p-4">
              {savedActivities.map(savedActivity => {
                const activityDetails = activities.find(activity => activity.id === savedActivity.activityId);
                if (!activityDetails) return null;

                return (
                  <SavedActivityCard
                    key={savedActivity.id}
                    savedActivity={savedActivity}
                    activityDetails={activityDetails}
                    onToggleCompletion={toggleActivityCompletion}
                    onRemove={removeSavedActivity}
                  />
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <p>No activities saved yet. Start exploring and save activities that resonate with you!</p>
        )}
      </div>
    </div>
  );
};

export default SkillDevelopment;
