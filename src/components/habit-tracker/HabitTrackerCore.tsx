
import React, { useState } from 'react';
import { startOfWeek, addDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useHabits, NewHabitForm } from '@/hooks/useHabits';
import { filterHabits, calculateStreaks } from '@/utils/habitUtils';
import HabitHeader from './HabitHeader';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import LoadingSpinner from './LoadingSpinner';

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ focusDimension }) => {
  const [newHabit, setNewHabit] = useState<NewHabitForm>({
    dimension: focusDimension || 'humility',
    description: '',
    frequency: 'daily',
  });
  const [addingHabit, setAddingHabit] = useState(false);
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

  return (
    <Tabs defaultValue={activeDimension} onValueChange={(value) => setActiveDimension(value as HEARTIDimension | 'all')}>
      <TabsList className="mb-6 grid grid-cols-7 w-full">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="humility">Humility</TabsTrigger>
        <TabsTrigger value="empathy">Empathy</TabsTrigger>
        <TabsTrigger value="accountability">Account.</TabsTrigger>
        <TabsTrigger value="resiliency">Resiliency</TabsTrigger>
        <TabsTrigger value="transparency">Transp.</TabsTrigger>
        <TabsTrigger value="inclusivity">Inclusivity</TabsTrigger>
      </TabsList>
      
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
  );
};

export default HabitTrackerCore;
