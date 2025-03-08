
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { HEARTIDimension } from '@/types';
import { getOrCreateAnonymousId } from '@/utils/localStorage';

export interface Habit {
  id?: string;
  userId: string;
  dimension: HEARTIDimension;
  description: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
}

export interface NewHabitForm {
  dimension: HEARTIDimension;
  description: string;
  frequency: 'daily' | 'weekly';
}

export const useHabits = (focusDimension?: HEARTIDimension) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  
  const handleAddHabit = async (newHabit: NewHabitForm) => {
    if (!newHabit.description) {
      toast({
        title: "Missing information",
        description: "Please enter a habit description",
        variant: "destructive",
      });
      return false;
    }
    
    const userId = getOrCreateAnonymousId();
    
    const habit: Habit = {
      userId,
      dimension: newHabit.dimension,
      description: newHabit.description,
      frequency: newHabit.frequency,
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
    
    toast({
      title: "Habit added",
      description: "Your new habit has been created",
    });
    
    return true;
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
  
  return {
    habits,
    loading,
    handleAddHabit,
    toggleHabitCompletion,
    deleteHabit
  };
};
