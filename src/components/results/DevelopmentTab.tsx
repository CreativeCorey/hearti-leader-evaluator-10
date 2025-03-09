
import React, { useState } from 'react';
import { HEARTIDimension } from '@/types';
import { Award, BookText, Brain, BarChart, Headphones, Leaf, Check, Plus } from 'lucide-react';
import { activityData } from '@/data/heartActivities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addActivityToHabitTracker } from '@/services/habitTrackerService';
import { useToast } from '@/hooks/use-toast';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { LucideIcon } from 'lucide-react';

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

const DevelopmentTab: React.FC<DevelopmentTabProps> = ({ focusDimension }) => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Filter activities for this dimension
  const activities = activityData.filter(activity => activity.dimension === focusDimension);
  
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
    addActivityToHabitTracker(userId, activity, 'daily');
    
    toast({
      title: "Added to Habit Tracker",
      description: "This activity has been added to your daily habits. Go to the Habits tab to track your progress.",
    });
  };
  
  const DimensionIcon = dimensionIcons[focusDimension] || Award;
  
  return (
    <div className="mb-4">
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6 rounded-md">
        <h3 className="font-medium flex items-center gap-2 text-indigo-800">
          <DimensionIcon className="text-indigo-600" size={20} />
          Development Recommendations for HEARTI™ Leadership
        </h3>
        <p className="text-indigo-700 mt-1">
          Choose 3 behaviors below that will help strengthen your leadership dimensions. We recommend focusing on your development area: 
          <strong className="uppercase"> {focusDimension}</strong>
        </p>
        <p className="text-indigo-700 mt-2 text-sm">
          Practice each behavior 30 times to develop a new habit and master the skill.
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DimensionIcon className="text-indigo-600" size={24} />
          Choose Activities for: {focusDimension.toUpperCase()}
        </h3>
        <p className="text-muted-foreground mb-6">
          These activities are designed to help you develop your {focusDimension} leadership dimension.
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
