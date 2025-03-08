
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { HEARTIDimension } from '@/types';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import HabitHeader from './HabitHeader';
import HabitForm from './HabitForm';
import HabitList from './HabitList';

interface Habit {
  id?: string;
  userId: string;
  dimension: HEARTIDimension;
  description: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
}

interface HabitTrackerCoreProps {
  focusDimension?: HEARTIDimension;
}

const HabitTrackerCore: React.FC<HabitTrackerCoreProps> = ({ focusDimension }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    dimension: focusDimension || 'humility',
    description: '',
    frequency: 'daily',
  });
  const [addingHabit, setAddingHabit] = useState(false);
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension | 'all'>(focusDimension || 'all');
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Get week dates for display
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  
  useEffect(() => {
    loadHabits();
  }, []);
  
  const loadHabits = async () => {
    try {
      setLoading(true);
      
      // Get the current user ID
      const userId = getOrCreateAnonymousId();
      
      // Fetch habits from local storage initially
      const storedHabits = localStorage.getItem('hearti-habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      }
      
      // Try to fetch from Supabase if available
      try {
        // Use fetch API instead of Supabase client to avoid TypeScript errors
        const response = await fetch(`https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/habits?user_id=eq.${userId}`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data && data.length > 0) {
            // Transform data to match our Habit interface
            const formattedHabits = data.map((habit: any) => ({
              id: habit.id,
              userId: habit.user_id,
              dimension: habit.dimension as HEARTIDimension,
              description: habit.description,
              frequency: habit.frequency,
              completedDates: habit.completed_dates || [],
              createdAt: habit.created_at
            }));
            
            setHabits(formattedHabits);
            // Save to local storage as backup
            localStorage.setItem('hearti-habits', JSON.stringify(formattedHabits));
          }
        }
      } catch (e) {
        console.log('Error fetching from Supabase, using local storage', e);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Error",
        description: "Could not load your habits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveHabits = async (updatedHabits: Habit[]) => {
    // Save to local storage
    localStorage.setItem('hearti-habits', JSON.stringify(updatedHabits));
    
    // Try to save to Supabase if available
    try {
      const userId = getOrCreateAnonymousId();
      
      // For each habit, upsert to Supabase
      for (const habit of updatedHabits) {
        if (!habit.id) continue; // Skip new habits that don't have an ID yet
        
        // Use fetch API instead of Supabase client to avoid TypeScript errors
        await fetch(`https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/habits?id=eq.${habit.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            dimension: habit.dimension,
            description: habit.description,
            frequency: habit.frequency,
            completed_dates: habit.completedDates
          })
        });
      }
    } catch (e) {
      console.log('Error saving to Supabase, saved to local storage only', e);
    }
  };
  
  const handleAddHabit = async () => {
    if (!newHabit.description) {
      toast({
        title: "Missing information",
        description: "Please enter a habit description",
        variant: "destructive",
      });
      return;
    }
    
    const userId = getOrCreateAnonymousId();
    
    const habit: Habit = {
      userId,
      dimension: newHabit.dimension as HEARTIDimension,
      description: newHabit.description,
      frequency: newHabit.frequency as 'daily' | 'weekly',
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    
    // Try to save to Supabase first
    try {
      // Use fetch API instead of Supabase client to avoid TypeScript errors
      const response = await fetch('https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/habits', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: userId,
          dimension: habit.dimension,
          description: habit.description,
          frequency: habit.frequency,
          completed_dates: habit.completedDates,
          created_at: habit.createdAt
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          habit.id = data[0].id;
        }
      }
    } catch (e) {
      console.log('Error saving to Supabase, will save to local storage only', e);
    }
    
    const updatedHabits = [...habits, habit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    
    // Reset form
    setNewHabit({
      dimension: activeDimension !== 'all' ? activeDimension : 'humility',
      description: '',
      frequency: 'daily',
    });
    setAddingHabit(false);
    
    toast({
      title: "Habit added",
      description: "Your new habit has been created",
    });
  };
  
  const toggleHabitCompletion = (habitId: string | undefined, date: Date) => {
    if (!habitId) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completedDates.includes(dateStr);
        
        return {
          ...habit,
          completedDates: wasCompleted
            ? habit.completedDates.filter(d => d !== dateStr)
            : [...habit.completedDates, dateStr]
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  };
  
  const deleteHabit = async (habitId: string | undefined) => {
    if (!habitId) return;
    
    try {
      // Try to delete from Supabase
      try {
        // Use fetch API instead of Supabase client to avoid TypeScript errors
        await fetch(`https://odwkgxdkjyccnkydxvjw.supabase.co/rest/v1/habits?id=eq.${habitId}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8'
          }
        });
      } catch (e) {
        console.log('Error deleting from Supabase', e);
      }
      
      // Remove from local state
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      setHabits(updatedHabits);
      saveHabits(updatedHabits);
      
      toast({
        title: "Habit deleted",
        description: "The habit has been removed",
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Could not delete the habit",
        variant: "destructive",
      });
    }
  };
  
  const filteredHabits = habits.filter(habit => 
    activeDimension === 'all' || habit.dimension === activeDimension
  );
  
  const calculateStreaks = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;
    
    // Sort dates in ascending order
    const sortedDates = [...habit.completedDates].sort();
    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = parseISO(sortedDates[i]);
      const prevDate = parseISO(sortedDates[i-1]);
      const diffDays = Math.abs((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
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
          onSave={handleAddHabit}
          onHabitChange={(value) => setNewHabit({...newHabit, ...value})}
        />
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-2">Loading your habits...</p>
        </div>
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
