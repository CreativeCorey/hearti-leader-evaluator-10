
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useHabitTracker } from '@/contexts/HabitTrackerContext';
import { HEARTIDimension } from '@/types';
import HabitList from './HabitList';
import HabitForm from './HabitForm';
import HabitHeader from './HabitHeader';
import HabitTabs from './HabitTabs';
import EmptyHabitState from './EmptyHabitState';
import LoadingSpinner from './LoadingSpinner';
import TodayHeader from './TodayHeader';
import SavedHabitsView from './SavedHabitsView';
import { useLanguage } from '@/contexts/language/LanguageContext';

interface HabitHeaderProps {
  habitCount: number;
}

interface HabitTabsProps {
  children: React.ReactNode;
  activeDimension: "all" | HEARTIDimension;
  onDimensionChange: (dimension: "all" | HEARTIDimension) => void;
}

const HabitTrackerContent: React.FC = () => {
  const { 
    habits, 
    loading, 
    filteredHabits, 
    weekDates, 
    toggleHabitCompletion, 
    deleteHabit,
  } = useHabitTracker();
  
  const [activeDimension, setActiveDimension] = useState<"all" | HEARTIDimension>("all");
  const { t } = useLanguage();
  
  // Calculate streaks for a habit
  const calculateStreaks = (habit: any) => {
    // For now, return a placeholder value
    return habit.completedDates?.length || 0;
  };
  
  return (
    <div className="relative">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <HabitHeader 
            habitCount={filteredHabits.length} 
          />
          
          <HabitTabs
            activeDimension={activeDimension}
            onDimensionChange={setActiveDimension}
          >
            <TabsContent value="all" className="mt-2">
              <TodayHeader />
              
              {filteredHabits.length === 0 ? (
                <EmptyHabitState />
              ) : (
                <HabitList 
                  habits={filteredHabits}
                  weekDates={weekDates}
                  onToggleHabit={toggleHabitCompletion}
                  onDeleteHabit={deleteHabit}
                  calculateStreaks={calculateStreaks}
                />
              )}
            </TabsContent>
            
            <TabsContent value="add" className="mt-2">
              <HabitForm />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-2">
              <SavedHabitsView habits={habits} />
            </TabsContent>
          </HabitTabs>
        </>
      )}
    </div>
  );
};

export default HabitTrackerContent;
