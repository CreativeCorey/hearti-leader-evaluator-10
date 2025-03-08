
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'mb-3 px-1' : 'mb-6'} flex justify-between items-center`}>
      <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>Your Habits</h3>
      
      {!addingHabit ? (
        <Button 
          onClick={onAddHabit} 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          className={`rounded-full flex items-center gap-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50 ${isMobile ? 'text-xs py-1 h-7 px-2.5' : ''}`}
        >
          <Plus size={isMobile ? 14 : 16} />
          {isMobile ? 'Add' : 'Add Habit'}
        </Button>
      ) : (
        <Button 
          onClick={onCancelAdd} 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          className={`rounded-full flex items-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50 ${isMobile ? 'text-xs py-1 h-7 px-2.5' : ''}`}
        >
          <X size={isMobile ? 14 : 16} />
          {isMobile ? 'Cancel' : 'Cancel'}
        </Button>
      )}
    </div>
  );
};

export default HabitHeader;
