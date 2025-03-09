
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { calculateStreaks } from '@/utils/habitUtils';
import { useHabitTracker } from '@/contexts/HabitTrackerContext';
import { useHabitForm } from '@/hooks/useHabitForm';
import HabitHeader from './HabitHeader';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import LoadingSpinner from './LoadingSpinner';
import HabitTabs from './HabitTabs';
import TodayHeader from './TodayHeader';
import EmptyHabitState from './EmptyHabitState';

const HabitTrackerContent: React.FC = () => {
  const {
    loading,
    filteredHabits,
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
  
  const onSaveHabit = async () => {
    const success = await handleAddHabit(newHabit);
    if (success) {
      resetForm(activeDimension);
    }
  };

  const handleDimensionChange = (dimension: typeof activeDimension) => {
    setActiveDimension(dimension);
  };

  return (
    <div className="space-y-6">
      <TodayHeader />
    
      <Tabs defaultValue={activeDimension} value={activeDimension}>
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
