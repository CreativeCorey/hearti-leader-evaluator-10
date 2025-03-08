
import React, { useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HEARTIDimension } from '@/types';
import { useHabits, NewHabitForm } from '@/hooks/useHabits';
import { filterHabits, calculateStreaks } from '@/utils/habitUtils';
import HabitHeader from './HabitHeader';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import LoadingSpinner from './LoadingSpinner';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ focusDimension }) => {
  const isMobile = useIsMobile();
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

  // Get today's formatted date for display
  const todayFormatted = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold">Today</h2>
        <p className="text-muted-foreground">{todayFormatted}</p>
      </div>
    
      <Tabs defaultValue={activeDimension} onValueChange={(value) => setActiveDimension(value as HEARTIDimension | 'all')}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className={`bg-gray-100 ${isMobile ? 'flex flex-wrap justify-start w-full gap-1' : ''}`}>
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
            <TabsTrigger value="humility" className="data-[state=active]:bg-white">
              {isMobile ? "H" : "Humility"}
            </TabsTrigger>
            <TabsTrigger value="empathy" className="data-[state=active]:bg-white">
              {isMobile ? "E" : "Empathy"}
            </TabsTrigger>
            <TabsTrigger value="accountability" className="data-[state=active]:bg-white">
              {isMobile ? "A" : "Account."}
            </TabsTrigger>
            <TabsTrigger value="resiliency" className="data-[state=active]:bg-white">
              {isMobile ? "R" : "Resiliency"}
            </TabsTrigger>
            <TabsTrigger value="transparency" className="data-[state=active]:bg-white">
              {isMobile ? "T" : "Transp."}
            </TabsTrigger>
            <TabsTrigger value="inclusivity" className="data-[state=active]:bg-white">
              {isMobile ? "I" : "Inclusivity"}
            </TabsTrigger>
          </TabsList>
        </div>
        
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
    </div>
  );
};

export default HabitTrackerCore;
