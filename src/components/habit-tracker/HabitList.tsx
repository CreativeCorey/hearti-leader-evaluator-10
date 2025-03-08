
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, Check, Calendar, ArrowRight } from 'lucide-react';
import { HEARTIDimension } from '@/types';
import { Habit } from '@/hooks/useHabits';
import HabitProgressCircle from './HabitProgressCircle';
import { useIsMobile } from '@/hooks/use-mobile';

interface HabitListProps {
  habits: Habit[];
  weekDates: Date[];
  onToggleHabit: (habitId: string | undefined, date: Date) => void;
  onDeleteHabit: (habitId: string | undefined) => void;
  calculateStreaks: (habit: Habit) => number;
}

const dimensionColors = {
  humility: 'bg-purple-100 text-purple-800 border-purple-200',
  empathy: 'bg-blue-100 text-blue-800 border-blue-200',
  accountability: 'bg-green-100 text-green-800 border-green-200',
  resiliency: 'bg-amber-100 text-amber-800 border-amber-200',
  transparency: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  inclusivity: 'bg-rose-100 text-rose-800 border-rose-200'
};

const dimensionProgressColors = {
  humility: { bg: '#E9D5FF', progress: '#9333EA' },
  empathy: { bg: '#DBEAFE', progress: '#3B82F6' },
  accountability: { bg: '#DCFCE7', progress: '#22C55E' },
  resiliency: { bg: '#FEF3C7', progress: '#F59E0B' },
  transparency: { bg: '#E0E7FF', progress: '#6366F1' },
  inclusivity: { bg: '#FCE7F3', progress: '#DB2777' }
};

const HabitList: React.FC<HabitListProps> = ({
  habits,
  weekDates,
  onToggleHabit,
  onDeleteHabit,
  calculateStreaks
}) => {
  const isMobile = useIsMobile();
  
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-muted-foreground">No habits found. Click "Add Habit" to create one.</p>
      </div>
    );
  }

  const today = new Date();

  return (
    <div className={`grid ${isMobile ? 'gap-3' : 'gap-4'}`}>
      {habits.map((habit) => {
        const streakCount = calculateStreaks(habit);
        const todayStr = format(today, 'yyyy-MM-dd');
        const isCompletedToday = habit.completedDates.includes(todayStr);
        
        // Calculate a simple completion percentage for today
        const completionPercentage = isCompletedToday ? 100 : 0;
        
        return (
          <div key={habit.id} className={`bg-white rounded-xl ${isMobile ? 'p-3' : 'p-5'} shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${dimensionColors[habit.dimension]}`}>
                  {isMobile ? habit.dimension.charAt(0).toUpperCase() : habit.dimension}
                </div>
                <span className="text-xs text-muted-foreground">{habit.frequency === 'daily' ? 'Daily' : 'Weekly'}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => onDeleteHabit(habit.id)}
              >
                <X size={16} />
              </Button>
            </div>
            
            <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold mb-1`}>{habit.description}</h3>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                Current streak: {streakCount} {streakCount === 1 ? 'day' : 'days'}
              </div>
            </div>
            
            <div className={`flex ${isMobile ? 'flex-col items-center' : 'justify-between items-center'} mt-3`}>
              <div className={`${isMobile ? 'mb-3' : 'flex-1'} flex items-center justify-center`}>
                <HabitProgressCircle 
                  percentage={completionPercentage}
                  dimension={habit.dimension} 
                  size={isMobile ? 80 : 100}
                  onClick={() => onToggleHabit(habit.id, today)}
                />
              </div>
              
              {!isMobile && (
                <div className="flex-1 flex items-center justify-center gap-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-slate-50"
                    onClick={() => onToggleHabit(habit.id, today)}
                  >
                    <Minus size={18} />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-slate-50"
                    onClick={() => onToggleHabit(habit.id, today)}
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              )}
            </div>
            
            <div className={`${isMobile ? 'mt-3' : 'mt-4'}`}>
              <Button 
                className={`w-full ${isMobile ? 'py-1.5 px-3 text-sm h-auto' : ''} bg-indigo-600 hover:bg-indigo-700 text-white`}
                onClick={() => onToggleHabit(habit.id, today)}
              >
                {isCompletedToday ? (
                  <>
                    <Check size={isMobile ? 14 : 16} className="mr-1.5" />
                    Completed
                  </>
                ) : (
                  <>
                    {isMobile ? 'Mark Complete' : 'Complete'}
                  </>
                )}
              </Button>
              
              {!isCompletedToday && (
                <Button 
                  variant="ghost" 
                  className={`w-full ${isMobile ? 'mt-1 text-xs py-1 h-auto' : 'mt-2'} text-indigo-600`}
                  onClick={() => onToggleHabit(habit.id, today)}
                >
                  Skip today
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;
