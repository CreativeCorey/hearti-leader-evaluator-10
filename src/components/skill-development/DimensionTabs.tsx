
import React from 'react';
import { Gauge, Search, Ear, BarChart, Users, TreePalm } from 'lucide-react';
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillActivity } from '@/data/heartActivities';
import ActivityCard from './ActivityCard';
import { SavedActivity } from '@/data/heartActivities';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface DimensionTabsProps {
  selectedDimension: string;
  setSelectedDimension: (dimension: string) => void;
  filteredActivities: SkillActivity[];
  savedActivities: SavedActivity[];
  onSaveActivity: (activity: SkillActivity, addToHabitTracker?: boolean, frequency?: 'daily' | 'weekly' | 'monthly') => void;
}

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

const DimensionTabs: React.FC<DimensionTabsProps> = ({ 
  selectedDimension, 
  setSelectedDimension, 
  filteredActivities, 
  savedActivities, 
  onSaveActivity 
}) => {
  const { currentLanguage } = useLanguage();

  // Adjust tab text size for languages with longer words
  const getTabStyles = () => {
    return ['zh', 'ja', 'de'].includes(currentLanguage) ? 'text-xs' : '';
  };

  return (
    <>
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
                onSave={onSaveActivity}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </>
  );
};

export default DimensionTabs;
