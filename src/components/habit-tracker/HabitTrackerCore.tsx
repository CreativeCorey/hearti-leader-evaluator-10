
import React, { useState } from 'react';
import { startOfWeek, addDays } from 'date-fns';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useHabits, NewHabitForm } from '@/hooks/useHabits';
import { filterHabits, calculateStreaks } from '@/utils/habitUtils';
import HabitHeader from './HabitHeader';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import LoadingSpinner from './LoadingSpinner';
import HabitTabs from './HabitTabs';
import TodayHeader from './TodayHeader';
import EmptyHabitState from './EmptyHabitState';

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ focusDimension }) => {
  // Form state
  const [newHabit, setNewHabit] = useState<NewHabitForm>({
    dimension: focusDimension || 'humility',
    description: '',
    frequency: 'daily',
  });
  const [addingHabit, setAddingHabit] = useState(false);
  
  // Active dimension & date tracking
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension | 'all'>(focusDimension || 'all');
  const [currentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Get week dates for display
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  
  // Use our custom hook for habit functionality
  const { habits, loading, handleAddHabit, toggleHabitCompletion, deleteHabit } = useHabits(focusDimension);
  
  // Filter habits based on active dimension
  const filteredHabits = filterHabits(habits, activeDimension);
  
  const onSaveHabit = async () => {
    const success = await handleAddHabit(newHabit);
    if (success) {
      // Reset form
      setNewHabit({
        dimension: activeDimension !== 'all' ? activeDimension : 'humility',
        description: '',
        frequency: 'daily',
      });
      setAddingHabit(false);
    }
  };

  const handleDimensionChange = (dimension: HEARTIDimension | 'all') => {
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
            onHabitChange={(value) => setNewHabit({...newHabit, ...value})}
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

export default HabitTrackerCore;
