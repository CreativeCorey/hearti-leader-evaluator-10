
import React, { useState } from 'react';
import { HEARTIDimension, HEARTIAssessment } from '@/types';
import { activityData } from '@/data/heartActivities';
import { addActivityToHabitTracker } from '@/services/habitTrackerService';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
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
  
  const getDimensionProgressData = () => {
    // Filter assessments for the currently selected dimension and sort by date
    if (!assessments || assessments.length === 0) {
      return [];
    }
    
    // Sort assessments by date (oldest first)
    const sortedAssessments = [...assessments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Map to data points for the chart
    return sortedAssessments.map(assessment => ({
      date: assessment.date,
      score: assessment.dimensionScores[activeDimension],
      formattedDate: format(new Date(assessment.date), 'MMM d, yy')
    }));
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
  
  const progressData = getDimensionProgressData();
  const dimensionColors = {
    humility: '#EE2D67',      // Pink
    empathy: '#3953A4',       // Deep Blue (swapped with transparency)
    accountability: '#00A249', // Vibrant Green
    resiliency: '#FFCC33',    // Golden Yellow
    transparency: '#18B7D9',  // Cyan (swapped with empathy)
    inclusivity: '#5B0F58'    // Deep Purple
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
      
      {progressData.length > 1 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your {activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1)} Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip
                    formatter={(value) => [`${value}/5`, 'Score']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name={activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1)}
                    stroke={dimensionColors[activeDimension]}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This chart shows your progress in the {activeDimension} dimension over time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your {activeDimension.charAt(0).toUpperCase() + activeDimension.slice(1)} Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Complete more assessments to track your progress over time.</p>
          </CardContent>
        </Card>
      )}
      
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
