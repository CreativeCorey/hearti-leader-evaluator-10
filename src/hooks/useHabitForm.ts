
import { useState } from 'react';
import { HEARTIDimension } from '@/types';
import { NewHabitForm } from '@/hooks/useHabits';

export function useHabitForm(focusDimension?: HEARTIDimension) {
  const [newHabit, setNewHabit] = useState<NewHabitForm>({
    dimension: focusDimension || 'humility',
    description: '',
    frequency: 'daily',
  });
  
  const [addingHabit, setAddingHabit] = useState(false);
  
  const resetForm = (activeDimension: HEARTIDimension | 'all') => {
    setNewHabit({
      dimension: activeDimension !== 'all' ? activeDimension : 'humility',
      description: '',
      frequency: 'daily',
    });
    setAddingHabit(false);
  };
  
  const updateHabit = (value: Partial<NewHabitForm>) => {
    setNewHabit({...newHabit, ...value});
  };
  
  return {
    newHabit,
    addingHabit,
    setAddingHabit,
    resetForm,
    updateHabit
  };
}
