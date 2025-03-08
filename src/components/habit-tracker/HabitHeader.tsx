
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HabitHeaderProps {
  addingHabit: boolean;
  onAddHabit: () => void;
  onCancelAdd: () => void;
}

const HabitHeader: React.FC<HabitHeaderProps> = ({ 
  addingHabit, 
  onAddHabit, 
  onCancelAdd 
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h3 className="text-lg font-medium">Your Habits</h3>
      
      {!addingHabit ? (
        <Button onClick={onAddHabit} variant="outline" size="sm" className="flex items-center gap-2">
          <Plus size={16} />
          Add Habit
        </Button>
      ) : (
        <Button onClick={onCancelAdd} variant="outline" size="sm" className="flex items-center gap-2">
          <X size={16} />
          Cancel
        </Button>
      )}
    </div>
  );
};

export default HabitHeader;
