
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Plus, Save, Check, X, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { HEARTIDimension } from '../types';
import { Badge } from '@/components/ui/badge';
import { getOrCreateAnonymousId } from '@/utils/localStorage';

interface Habit {
  id?: string;
  userId: string;
  dimension: HEARTIDimension;
  description: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  createdAt: string;
}

interface HabitTrackerProps {
  focusDimension?: HEARTIDimension;
}

const dimensionColors = {
  humility: 'bg-purple-100 text-purple-800 border-purple-200',
  empathy: 'bg-blue-100 text-blue-800 border-blue-200',
  accountability: 'bg-green-100 text-green-800 border-green-200',
  resiliency: 'bg-amber-100 text-amber-800 border-amber-200',
  transparency: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  inclusivity: 'bg-rose-100 text-rose-800 border-rose-200'
};

const HabitTracker: React.FC<HabitTrackerProps> = ({ focusDimension }) => {
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
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Calendar className="text-indigo-600" size={24} />
          HEARTI Habit Tracker
        </CardTitle>
        <CardDescription>
          Build consistent habits to strengthen your leadership dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
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
          
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Habits</h3>
            
            {!addingHabit ? (
              <Button onClick={() => setAddingHabit(true)} variant="outline" size="sm" className="flex items-center gap-2">
                <Plus size={16} />
                Add Habit
              </Button>
            ) : (
              <Button onClick={() => setAddingHabit(false)} variant="outline" size="sm" className="flex items-center gap-2">
                <X size={16} />
                Cancel
              </Button>
            )}
          </div>
          
          {addingHabit && (
            <Card className="mb-6 border border-dashed">
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="habit-dimension">Dimension</Label>
                      <select
                        id="habit-dimension"
                        value={newHabit.dimension}
                        onChange={(e) => setNewHabit({...newHabit, dimension: e.target.value as HEARTIDimension})}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="humility">Humility</option>
                        <option value="empathy">Empathy</option>
                        <option value="accountability">Accountability</option>
                        <option value="resiliency">Resiliency</option>
                        <option value="transparency">Transparency</option>
                        <option value="inclusivity">Inclusivity</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="habit-frequency">Frequency</Label>
                      <select
                        id="habit-frequency"
                        value={newHabit.frequency}
                        onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value as 'daily' | 'weekly'})}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="habit-description">Description</Label>
                    <Input
                      id="habit-description"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                      placeholder="e.g., Practice active listening for 10 minutes"
                      className="mt-1"
                    />
                  </div>
                  
                  <Button onClick={handleAddHabit} className="w-full mt-2">
                    <Save size={16} className="mr-2" />
                    Save Habit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-2">Loading your habits...</p>
            </div>
          ) : filteredHabits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No habits found. Click "Add Habit" to create one.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-7 gap-2 mb-2">
                <div className="font-medium text-sm text-muted-foreground">Habit</div>
                {weekDates.map((date, i) => (
                  <div 
                    key={i} 
                    className={`text-center text-sm font-medium ${
                      isSameDay(date, new Date()) ? 'text-indigo-600' : 'text-muted-foreground'
                    }`}
                  >
                    <div>{format(date, 'EEE')}</div>
                    <div>{format(date, 'd')}</div>
                  </div>
                ))}
              </div>
              
              {filteredHabits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-7 gap-2 items-center py-3 border-t">
                  <div className="flex flex-col">
                    <div className="flex items-start">
                      <Badge className={`${dimensionColors[habit.dimension]} font-normal mr-2`}>
                        {habit.dimension.substring(0, 3)}
                      </Badge>
                      <span className="text-sm">{habit.description}</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <span className="mr-2">{habit.frequency === 'daily' ? 'Daily' : 'Weekly'}</span>
                      <span className="mr-1">•</span>
                      <span>Streak: {calculateStreaks(habit)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 ml-2" 
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  </div>
                  
                  {weekDates.map((date, i) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDates.includes(dateStr);
                    
                    return (
                      <div key={i} className="flex justify-center">
                        <Checkbox 
                          checked={isCompleted}
                          onCheckedChange={() => toggleHabitCompletion(habit.id, date)}
                          className={isCompleted ? 'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500' : ''}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 text-sm text-muted-foreground rounded-b-lg">
        <p>Consistently practicing these habits will strengthen your HEARTI skills over time.</p>
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
