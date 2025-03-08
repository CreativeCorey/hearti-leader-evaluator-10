
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
        <Button 
          onClick={onAddHabit} 
          variant="outline" 
          size="sm" 
          className="rounded-full flex items-center gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
        >
          <Plus size={16} />
          Add Habit
        </Button>
      ) : (
        <Button 
          onClick={onCancelAdd} 
          variant="outline" 
          size="sm" 
          className="rounded-full flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <X size={16} />
          Cancel
        </Button>
      )}
    </div>
  );
};

export default HabitHeader;
