
import React, { useState } from 'react';
import { HEARTIDimension } from '@/types';
import { Award, BookText, Brain, BarChart, Headphones, Leaf, Check, Plus, Clock } from 'lucide-react';
import { activityData } from '@/data/heartActivities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addActivityToHabitTracker } from '@/services/habitTrackerService';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { LucideIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DevelopmentTabProps {
  focusDimension: HEARTIDimension;
}

// Updated type definition to use LucideIcon type
const dimensionIcons: Record<string, LucideIcon> = {
  humility: Award,
  empathy: Brain,
  accountability: BarChart,
  resiliency: Leaf,
  transparency: BookText,
  inclusivity: Headphones,
};

const dimensionLabels = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension }) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension>(focusDimension);
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { toast } = useToast();
  
  // Filter activities for the active dimension
  const activities = activityData.filter(activity => activity.dimension === activeDimension);
  
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
  
  const DimensionIcon = dimensionIcons[activeDimension] || Award;
  
  return (
    <div className="mb-4">
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6 rounded-md">
        <h3 className="font-medium flex items-center gap-2 text-indigo-800">
          <DimensionIcon className="text-indigo-600" size={20} />
          Development Recommendations for HEARTI™ Leadership
        </h3>
        <p className="text-indigo-700 mt-1">
          Choose 3 behaviors below that will help strengthen your leadership dimensions. We recommend focusing on your development area: 
          <strong className="uppercase"> {dimensionLabels[focusDimension]}</strong>
        </p>
        <p className="text-indigo-700 mt-2 text-sm">
          Practice each behavior 1 time to develop a new habit and master the skill.
        </p>
      </div>
      
      {/* HEARTI Navigation */}
      <Tabs 
        value={activeDimension} 
        onValueChange={(value) => setActiveDimension(value as HEARTIDimension)}
        className="mb-6"
      >
        <div className="mb-2 text-sm font-medium">Choose a dimension:</div>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="humility" className="text-xs flex flex-col items-center gap-1 py-2">
            <Award size={16} />
            <span>Humility</span>
          </TabsTrigger>
          <TabsTrigger value="empathy" className="text-xs flex flex-col items-center gap-1 py-2">
            <Brain size={16} />
            <span>Empathy</span>
          </TabsTrigger>
          <TabsTrigger value="accountability" className="text-xs flex flex-col items-center gap-1 py-2">
            <BarChart size={16} />
            <span>Accountability</span>
          </TabsTrigger>
          <TabsTrigger value="resiliency" className="text-xs flex flex-col items-center gap-1 py-2">
            <Leaf size={16} />
            <span>Resiliency</span>
          </TabsTrigger>
          <TabsTrigger value="transparency" className="text-xs flex flex-col items-center gap-1 py-2">
            <BookText size={16} />
            <span>Transparency</span>
          </TabsTrigger>
          <TabsTrigger value="inclusivity" className="text-xs flex flex-col items-center gap-1 py-2">
            <Headphones size={16} />
            <span>Inclusivity</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DimensionIcon className="text-indigo-600" size={24} />
          Choose Activities for: {dimensionLabels[activeDimension].toUpperCase()}
        </h3>
        <p className="text-muted-foreground mb-6">
          These activities are designed to help you develop your {activeDimension} leadership dimension.
          Select up to 3 activities to focus on.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.slice(0, 9).map(activity => {
            const isSelected = selectedActivities.includes(activity.id);
            
            return (
              <Card 
                key={activity.id} 
                className={`cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'hover:border-indigo-200'}`}
                onClick={() => handleSelectActivity(activity.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`mt-1 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {isSelected ? <Check size={18} /> : <Plus size={18} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{activity.category}</h4>
                      <p className="text-sm mt-1">{activity.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="mb-3">
                        <label className="text-sm flex items-center gap-1 mb-1 text-indigo-700">
                          <Clock size={14} />
                          Frequency:
                        </label>
                        <div className="flex gap-2">
                          <Toggle
                            pressed={selectedFrequency === 'daily'}
                            onPressedChange={() => setSelectedFrequency('daily')}
                            className={`flex-1 text-xs py-1 px-2 h-8 ${selectedFrequency === 'daily' ? 'bg-blue-100 border-blue-300 text-blue-800' : ''}`}
                          >
                            Daily
                          </Toggle>
                          <Toggle
                            pressed={selectedFrequency === 'weekly'}
                            onPressedChange={() => setSelectedFrequency('weekly')}
                            className={`flex-1 text-xs py-1 px-2 h-8 ${selectedFrequency === 'weekly' ? 'bg-purple-100 border-purple-300 text-purple-800' : ''}`}
                          >
                            Weekly
                          </Toggle>
                          <Toggle
                            pressed={selectedFrequency === 'monthly'}
                            onPressedChange={() => setSelectedFrequency('monthly')}
                            className={`flex-1 text-xs py-1 px-2 h-8 ${selectedFrequency === 'monthly' ? 'bg-orange-100 border-orange-300 text-orange-800' : ''}`}
                          >
                            Monthly
                          </Toggle>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2 text-indigo-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToHabitTracker(activity.id);
                        }}
                      >
                        <BarChart size={14} />
                        Add to Habit Tracker
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DevelopmentTab;
