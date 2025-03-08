
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Target, ListFilter } from 'lucide-react';
import { HEARTIDimension } from '../types';
import { activityData } from '@/data/heartActivities';
import { useActivities } from '@/hooks/useActivities';
import ActivityList from './skill-development/ActivityList';
import SavedActivityList from './skill-development/SavedActivityList';
import { useIsMobile } from '@/hooks/use-mobile';

interface SkillDevelopmentProps {
  focusDimension?: HEARTIDimension;
}

const SkillDevelopment: React.FC<SkillDevelopmentProps> = ({ focusDimension }) => {
  const isMobile = useIsMobile();
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension | 'all'>(focusDimension || 'all');
  const [activeView, setActiveView] = useState<'explore' | 'saved'>('explore');
  
  const { 
    savedActivities, 
    loading, 
    saveActivity, 
    toggleActivityCompletion, 
    removeSavedActivity 
  } = useActivities();
  
  useEffect(() => {
    if (focusDimension) {
      setActiveDimension(focusDimension);
    }
  }, [focusDimension]);
  
  const filteredActivities = activityData.filter(activity => 
    activeDimension === 'all' || activity.dimension === activeDimension
  );
  
  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, typeof activityData>);
  
  const filteredSavedActivities = savedActivities.filter(activity => 
    activeDimension === 'all' || activity.dimension === activeDimension
  );

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-orange to-yellow rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2 text-white">
          <Target className="text-white" size={24} />
          HEARTI Skill Development
        </CardTitle>
        <CardDescription className="text-white/90">
          Improve your leadership dimensions with these targeted activities
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
        <Tabs defaultValue={activeDimension} onValueChange={(value) => setActiveDimension(value as HEARTIDimension | 'all')}>
          <div className="flex flex-col gap-4 mb-6">
            <div className="mobile-tabs-container">
              <TabsList className="mobile-tabs">
                <TabsTrigger value="all" className="mobile-tab">All</TabsTrigger>
                <TabsTrigger value="humility" className="mobile-tab">
                  {isMobile ? 'H' : 'Humility'}
                </TabsTrigger>
                <TabsTrigger value="empathy" className="mobile-tab">
                  {isMobile ? 'E' : 'Empathy'}
                </TabsTrigger>
                <TabsTrigger value="accountability" className="mobile-tab">
                  {isMobile ? 'A' : 'Account.'}
                </TabsTrigger>
                <TabsTrigger value="resiliency" className="mobile-tab">
                  {isMobile ? 'R' : 'Resiliency'}
                </TabsTrigger>
                <TabsTrigger value="transparency" className="mobile-tab">
                  {isMobile ? 'T' : 'Transp.'}
                </TabsTrigger>
                <TabsTrigger value="inclusivity" className="mobile-tab">
                  {isMobile ? 'I' : 'Inclusivity'}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs">
              <Button 
                size="sm" 
                variant={activeView === 'explore' ? "default" : "ghost"}
                className="rounded-md text-xs h-7"
                onClick={() => setActiveView('explore')}
              >
                Explore Activities
              </Button>
              <Button 
                size="sm" 
                variant={activeView === 'saved' ? "default" : "ghost"}
                className="rounded-md text-xs h-7"
                onClick={() => setActiveView('saved')}
              >
                My Activities ({savedActivities.length})
              </Button>
            </div>
          </div>
          
          {activeView === 'explore' ? (
            <ActivityList 
              groupedActivities={groupedActivities} 
              savedActivities={savedActivities}
              onSaveActivity={saveActivity}
            />
          ) : (
            <SavedActivityList 
              filteredSavedActivities={filteredSavedActivities}
              loading={loading}
              onToggleCompletion={toggleActivityCompletion}
              onRemove={removeSavedActivity}
            />
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 text-sm text-muted-foreground rounded-b-lg">
        <p>Regularly practicing these activities will help you develop your HEARTI leadership dimensions.</p>
      </CardFooter>
    </Card>
  );
};

export default SkillDevelopment;
