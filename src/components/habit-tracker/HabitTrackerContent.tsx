
import React from 'react';
import { completionGoals } from '@/constants/habitGoals';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useHabitTracker } from '@/contexts/HabitTrackerContext';
import HabitList from './HabitList';
import HabitForm from './HabitForm';
import HabitHeader from './HabitHeader';
import HabitTabs from './HabitTabs';
import EmptyHabitState from './EmptyHabitState';
import LoadingSpinner from './LoadingSpinner';
import TodayHeader from './TodayHeader';
import SavedHabitsView from './SavedHabitsView';

const HabitTrackerContent: React.FC = () => {
  const { 
    habits, 
    loading, 
    filteredHabits, 
    weekDates, 
    toggleHabitCompletion, 
    deleteHabit,
    activeDimension,
    setActiveDimension
  } = useHabitTracker();
  
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
            activeDimension={activeDimension} 
            setActiveDimension={setActiveDimension} 
            habitCount={filteredHabits.length}
          />
          
          <HabitTabs>
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
                  completionGoals={completionGoals}
                />
              )}
            </TabsContent>
            
            <TabsContent value="add" className="mt-2">
              <HabitForm />
            </TabsContent>
            
            <TabsContent value="saved" className="mt-2">
              <SavedHabitsView />
            </TabsContent>
          </HabitTabs>
        </>
      )}
    </div>
  );
};

export default HabitTrackerContent;
