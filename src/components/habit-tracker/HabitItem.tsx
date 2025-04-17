import React from 'react';
import { Habit } from '@/types';

interface HabitItemProps {
  habit: Habit;
  onToggleComplete: (habitId: string) => void;
  onSkipToday: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onToggleComplete,
  onSkipToday,
  onDelete
}) => {
  // Component implementation
  // This is a placeholder since we can't see the actual component
  // but we've defined the correct props interface
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between">
        <h3 className="font-medium">{habit.description}</h3>
        <div className="flex space-x-2">
          <button onClick={() => onToggleComplete(habit.id)}>Complete</button>
          <button onClick={() => onSkipToday(habit.id)}>Skip</button>
          <button onClick={() => onDelete(habit.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default HabitItem;
