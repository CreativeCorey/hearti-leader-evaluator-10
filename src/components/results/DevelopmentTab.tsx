
import React, { useState } from 'react';
import { HEARTIDimension } from '@/types';
import { activityData } from '@/data/heartActivities';
import { addActivityToHabitTracker } from '@/services/habitTrackerService';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import DimensionTabs from './development/DimensionTabs';
import DimensionChart from './development/DimensionChart';
import InfoBanner from './development/InfoBanner';
import ActivityList from './development/ActivityList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

interface DevelopmentTabProps {
  focusDimension: HEARTIDimension;
}

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension }) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension>(focusDimension);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartView, setChartView] = useState<'focused' | 'all'>('focused');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Filter activities for the active dimension
  const activities = activityData.filter(activity => activity.dimension === activeDimension);
  
  // Sample dimension scores (replace with actual data in production)
  const dimensionScores = {
    humility: 3.8,
    empathy: 3.6,
    accountability: 4.1,
    resiliency: 3.7,
    transparency: 3.9,
    inclusivity: 3.5
  };
  
  const handleSelectActivity = (activityId: string) => {
    // Toggle selection (max 3)
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(prev => prev.filter(id => id !== activityId));
    } else if (selectedActivities.length < 3) {
      setSelectedActivities(prev => [...prev, activityId]);
    } else {
      toast({
        title: "Maximum activities selected",
        description: "You can only select up to 3 activities. Deselect one before adding another.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddToHabitTracker = (activityId: string) => {
    const activity = activityData.find(a => a.id === activityId);
    if (!activity) return;
    
    const userId = getOrCreateAnonymousId();
    addActivityToHabitTracker(userId, activity, selectedFrequency);
    
    toast({
      title: "Added to Habit Tracker",
      description: `This activity has been added to your ${selectedFrequency} habits. Go to the Habits tab to track your progress.`,
    });
  };
  
  return (
    <div className="mb-4">
      <InfoBanner focusDimension={focusDimension} />
      
      {/* HEARTI Navigation */}
      <DimensionTabs 
        activeDimension={activeDimension} 
        onDimensionChange={setActiveDimension}
      />
      
      {/* Chart section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">HEARTI Dimension Visualization</h3>
          <Tabs 
            value={chartView} 
            onValueChange={(value) => setChartView(value as 'focused' | 'all')}
            className="ml-auto"
          >
            <TabsList>
              <TabsTrigger value="focused" className="text-xs">
                Focus View
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                Complete View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <DimensionChart 
          dimensionScores={dimensionScores}
          activeDimension={activeDimension}
          showAllDimensions={chartView === 'all'}
        />
        
        <p className="text-sm text-muted-foreground mt-2">
          {chartView === 'focused' 
            ? `This chart highlights your score for ${activeDimension}. Switch to the Complete View to see all dimensions.` 
            : `This chart shows all your HEARTI dimensions, with ${activeDimension} in context of your overall profile.`}
        </p>
      </div>
      
      <ActivityList
        activeDimension={activeDimension}
        activities={activities}
        selectedActivities={selectedActivities}
        selectedFrequency={selectedFrequency}
        onActivitySelect={handleSelectActivity}
        onFrequencyChange={setSelectedFrequency}
        onAddToHabitTracker={handleAddToHabitTracker}
      />
    </div>
  );
};

export default DevelopmentTab;
