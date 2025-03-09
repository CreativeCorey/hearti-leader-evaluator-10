
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { calculateStreaks } from '@/utils/habitUtils';
import { useHabitTracker } from '@/contexts/HabitTrackerContext';
import { useHabitForm } from '@/hooks/useHabitForm';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import HabitHeader from './HabitHeader';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import LoadingSpinner from './LoadingSpinner';
import HabitTabs from './HabitTabs';
import TodayHeader from './TodayHeader';
import EmptyHabitState from './EmptyHabitState';
import SavedHabitsView from './SavedHabitsView';

const HabitTrackerContent: React.FC = () => {
  const {
    loading,
    filteredHabits,
    allHabits,
    activeDimension,
    weekDates,
    handleAddHabit,
    toggleHabitCompletion,
    deleteHabit,
    setActiveDimension
  } = useHabitTracker();

  const {
    newHabit,
    addingHabit,
    setAddingHabit,
    resetForm,
    updateHabit
  } = useHabitForm(activeDimension !== 'all' ? activeDimension : undefined);
  
  const [showSavedHabits, setShowSavedHabits] = useState(false);
  
  const onSaveHabit = async () => {
    const success = await handleAddHabit(newHabit);
    if (success) {
      resetForm(activeDimension);
    }
  };

  const handleDimensionChange = (dimension: typeof activeDimension) => {
    setActiveDimension(dimension);
    if (dimension !== 'all') {
      resetForm(dimension);
    }
  };

  return (
    <div className="space-y-6">
      <TodayHeader />
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Habit Tracker</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowSavedHabits(!showSavedHabits)}
          className="flex items-center gap-1"
        >
          <Archive size={16} />
          {showSavedHabits ? 'Hide' : 'View'} Saved Habits
        </Button>
      </div>
      
      {showSavedHabits && (
        <div className="mb-6">
          <SavedHabitsView habits={allHabits} />
        </div>
      )}
    
      <Tabs defaultValue={activeDimension} value={activeDimension} className="w-full">
        <HabitTabs 
          activeDimension={activeDimension} 
          onDimensionChange={handleDimensionChange}
        />
        
        <HabitHeader 
          addingHabit={addingHabit} 
          onAddHabit={() => setAddingHabit(true)} 
          onCancelAdd={() => setAddingHabit(false)} 
        />
        
        {addingHabit && (
          <HabitForm
            newHabit={newHabit}
            onCancel={() => setAddingHabit(false)}
            onSave={onSaveHabit}
            onHabitChange={updateHabit}
          />
        )}
        
        {loading ? (
          <LoadingSpinner />
        ) : filteredHabits.length === 0 ? (
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
      </Tabs>
    </div>
  );
};

export default HabitTrackerContent;
