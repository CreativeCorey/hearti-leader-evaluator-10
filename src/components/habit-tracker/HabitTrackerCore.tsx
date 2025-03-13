
import React, { useState } from 'react';
import { HEARTIDimension } from '@/types';
import { HabitTrackerProvider } from '@/contexts/HabitTrackerContext';
import HabitHeader from './HabitHeader';
import HabitList from './HabitList';
import { useLanguage } from '@/contexts/language/LanguageContext';
import { eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { completionGoals } from './HabitTrackerContent';

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ 
  focusDimension 
}) => {
  const [addingHabit, setAddingHabit] = useState(false);
  const { t } = useLanguage();
  
  // Get current week dates
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start week on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Mock functions to satisfy prop types (actual implementations will come from the provider)
  const handleAddHabit = () => setAddingHabit(true);
  const handleCancelAdd = () => setAddingHabit(false);
  const handleToggleHabit = () => {};
  const handleDeleteHabit = () => {};
  const calculateStreaks = () => 0;
  
  return (
    <HabitTrackerProvider focusDimension={focusDimension}>
      <div className="space-y-4">
        <HabitHeader 
          addingHabit={addingHabit} 
          onAddHabit={handleAddHabit} 
          onCancelAdd={handleCancelAdd} 
        />
        <HabitList 
          habits={[]}
          weekDates={weekDates}
          onToggleHabit={handleToggleHabit}
          onDeleteHabit={handleDeleteHabit}
          calculateStreaks={calculateStreaks}
        />
      </div>
    </HabitTrackerProvider>
  );
};

export default HabitTrackerCore;
