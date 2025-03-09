
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Hexagon, ListFilter, Heart, BarChart, LucideIcon, Users, Leaf, Eye, Sun } from 'lucide-react';
import { HEARTIDimension } from '../types';
import { activityData } from '@/data/heartActivities';
import { useActivities } from '@/hooks/useActivities';
import ActivityList from './skill-development/ActivityList';
import SavedActivityList from './skill-development/SavedActivityList';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toggle } from '@/components/ui/toggle';

interface SkillDevelopmentProps {
  focusDimension?: HEARTIDimension;
}

const dimensionLabels = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};

// Map dimensions to their corresponding icons as specified
const dimensionIcons: Record<HEARTIDimension | 'all', LucideIcon> = {
  humility: Sun,         // Humility: Sun
  empathy: Heart,        // Empathy: Heart
  accountability: BarChart, // Accountability: Chart (using BarChart as the closest alternative)
  resiliency: Leaf,      // Resiliency: Plant (using Leaf as the closest alternative)
  transparency: Eye,     // Transparency: Eye (for looking glass)
  inclusivity: Users,    // Inclusivity: Users
  all: Hexagon           // All dimensions
};

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

  const renderDimensionIcon = (dimension: HEARTIDimension | 'all', size = 16) => {
    const IconComponent = dimensionIcons[dimension];
    return <IconComponent size={size} />;
  };

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-orange to-yellow rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2 text-white">
          <Hexagon className="text-white" size={24} />
          HEARTI Skill Development
        </CardTitle>
        <CardDescription className="text-white/90">
          Choose 3 behaviors to practice 21 times to master your HEARTI leadership dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
        <Tabs defaultValue={activeDimension} onValueChange={(value) => setActiveDimension(value as HEARTIDimension | 'all')}>
          <div className="flex flex-col gap-4 mb-6">
            <div className="mobile-tabs-container">
              <TabsList className="grid grid-cols-7 gap-1 w-full">
                <TabsTrigger value="all" className="flex flex-col items-center gap-1 p-2">
                  {renderDimensionIcon('all')}
                  <span className={isMobile ? "text-[10px]" : "text-xs"}>All</span>
                </TabsTrigger>
                <TabsTrigger value="humility" className="flex flex-col items-center gap-1 p-2">
                  {renderDimensionIcon('humility')}
                  <span className={isMobile ? "text-[10px]" : "text-xs"}>{isMobile ? 'H' : 'Humility'}</span>
                </TabsTrigger>
                <TabsTrigger value="empathy" className="flex flex-col items-center gap-1 p-2">
                  {renderDimensionIcon('empathy')}
                  <span className={isMobile ? "text-[10px]" : "text-xs"}>{isMobile ? 'E' : 'Empathy'}</span>
                </TabsTrigger>
                <TabsTrigger value="accountability" className="flex flex-col items-center gap-1 p-2">
                  {renderDimensionIcon('accountability')}
                  <span className={isMobile ? "text-[10px]" : "text-xs"}>{isMobile ? 'A' : 'Account.'}</span>
                </TabsTrigger>
                <TabsTrigger value="resiliency" className="flex flex-col items-center gap-1 p-2">
                  {renderDimensionIcon('resiliency')}
                  <span className={isMobile ? "text-[10px]" : "text-xs"}>{isMobile ? 'R' : 'Resiliency'}</span>
                </TabsTrigger>
                <TabsTrigger value="transparency" className="flex flex-col items-center gap-1 p-2">
                  {renderDimensionIcon('transparency')}
                  <span className={isMobile ? "text-[10px]" : "text-xs"}>{isMobile ? 'T' : 'Transp.'}</span>
                </TabsTrigger>
                <TabsTrigger value="inclusivity" className="flex flex-col items-center gap-1 p-2">
                  {renderDimensionIcon('inclusivity')}
                  <span className={isMobile ? "text-[10px]" : "text-xs"}>{isMobile ? 'I' : 'Inclusivity'}</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex items-center justify-center p-1 rounded-lg bg-muted">
              <Toggle
                pressed={activeView === 'explore'}
                onPressedChange={() => setActiveView('explore')}
                className={`w-1/2 rounded-md ${activeView === 'explore' ? 'bg-primary text-white' : ''}`}
              >
                <span className="text-xs">Explore Activities</span>
              </Toggle>
              <Toggle
                pressed={activeView === 'saved'}
                onPressedChange={() => setActiveView('saved')}
                className={`w-1/2 rounded-md ${activeView === 'saved' ? 'bg-primary text-white' : ''}`}
              >
                <span className="text-xs">My Activities ({savedActivities.length}/3)</span>
              </Toggle>
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
        <p>Select 3 behaviors that balance your strengths and vulnerability areas. Practice each 21 times to form lasting habits.</p>
      </CardFooter>
    </Card>
  );
};

export default SkillDevelopment;
