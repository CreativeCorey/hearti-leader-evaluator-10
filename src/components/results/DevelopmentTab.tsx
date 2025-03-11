
import React, { useState } from 'react';
import { HEARTIDimension, HEARTIAssessment } from '@/types';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DevelopmentTabProps {
  focusDimension: HEARTIDimension;
  assessments?: HEARTIAssessment[];
}

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension, assessments = [] }) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension>(focusDimension);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartView, setChartView] = useState<'focused' | 'all'>('focused');
  const [showActivities, setShowActivities] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const activities = activityData.filter(activity => activity.dimension === activeDimension);
  
  // Get the most recent assessment's dimension scores
  const latestAssessment = assessments.length > 0 ? assessments[0] : null;
  const dimensionScores = latestAssessment ? latestAssessment.dimensionScores : {
    humility: 0,
    empathy: 0,
    accountability: 0,
    resiliency: 0,
    transparency: 0,
    inclusivity: 0
  };
  
  const handleSelectActivity = (activityId: string) => {
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
  
  const toggleActivities = () => {
    setShowActivities(prev => !prev);
  };
  
  return (
    <div className="mb-4">
      <InfoBanner focusDimension={focusDimension} />
      
      <DimensionTabs 
        activeDimension={activeDimension} 
        onDimensionChange={setActiveDimension}
      />
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">HEARTI Spectra</h3>
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
        
        <div className="w-full h-[300px] mx-auto max-w-[500px]">
          <DimensionChart 
            dimensionScores={dimensionScores}
            activeDimension={activeDimension}
            showAllDimensions={chartView === 'all'}
          />
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          {chartView === 'focused' 
            ? `This chart highlights your score for ${activeDimension}. Switch to the Complete View to see all dimensions.` 
            : `This chart shows all your HEARTI dimensions, with ${activeDimension} in context of your overall profile.`}
        </p>
      </div>
      
      {/* Remove historical progress chart from this tab since it should only appear in Report section */}
      
      <Button 
        variant="outline" 
        onClick={toggleActivities}
        className="w-full mb-4 flex justify-between items-center"
      >
        <span>Developmental Activities</span>
        {showActivities ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {showActivities && (
        <ActivityList
          activeDimension={activeDimension}
          activities={activities}
          selectedActivities={selectedActivities}
          selectedFrequency={selectedFrequency}
          onActivitySelect={handleSelectActivity}
          onFrequencyChange={setSelectedFrequency}
          onAddToHabitTracker={handleAddToHabitTracker}
        />
      )}
    </div>
  );
};

export default DevelopmentTab;
