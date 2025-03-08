import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Target, Award, Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getOrCreateAnonymousId } from '@/utils/localStorage';
import { HEARTIDimension } from '../types';

interface SkillActivity {
  id: string;
  dimension: HEARTIDimension;
  category: string;
  description: string;
}

interface SavedActivity {
  id?: string;
  userId: string;
  activityId: string;
  dimension: HEARTIDimension;
  completed: boolean;
  savedAt: string;
}

interface SkillDevelopmentProps {
  focusDimension?: HEARTIDimension;
}

// Activity data based on the provided lists
const activityData: SkillActivity[] = [
  // Humility Activities
  { id: 'h1', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Write down three things you're grateful for about your team every day." },
  { id: 'h2', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Reflect on a recent mistake and identify what you learned from it." },
  { id: 'h3', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Keep a journal to track moments when you felt proud or overly confident—analyze why." },
  { id: 'h4', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Ask yourself daily: \"Am I listening more than I'm speaking?\"" },
  { id: 'h5', dimension: 'humility', category: 'Self-Reflection & Awareness', description: "Identify one area where you can improve as a leader or colleague." },
  { id: 'h6', dimension: 'humility', category: 'Active Listening', description: "Focus fully on the speaker during conversations—no multitasking." },
  { id: 'h7', dimension: 'humility', category: 'Active Listening', description: "Paraphrase what someone says before responding to ensure understanding." },
  { id: 'h8', dimension: 'humility', category: 'Active Listening', description: "Avoid interrupting others while they're sharing ideas." },
  { id: 'h9', dimension: 'humility', category: 'Active Listening', description: "Ask clarifying questions to show genuine interest." },
  { id: 'h10', dimension: 'humility', category: 'Acknowledging Others', description: "Publicly recognize a teammate's contribution in a meeting." },

  // Empathy Activities
  { id: 'e1', dimension: 'empathy', category: 'Active Listening', description: "Focus entirely on the speaker without distractions." },
  { id: 'e2', dimension: 'empathy', category: 'Active Listening', description: "Avoid interrupting while someone is sharing their thoughts." },
  { id: 'e3', dimension: 'empathy', category: 'Active Listening', description: "Paraphrase what someone says to confirm understanding." },
  { id: 'e4', dimension: 'empathy', category: 'Active Listening', description: "Ask open-ended questions like, \"How did that make you feel?\"" },
  { id: 'e5', dimension: 'empathy', category: 'Perspective-Taking', description: "Imagine yourself in a coworker's situation before reacting." },
  { id: 'e6', dimension: 'empathy', category: 'Perspective-Taking', description: "Spend a day shadowing someone in a different role to understand their challenges." },
  { id: 'e7', dimension: 'empathy', category: 'Perspective-Taking', description: "Role-play scenarios from another team member's point of view." },
  { id: 'e8', dimension: 'empathy', category: 'Building Connections', description: "Schedule regular one-on-one check-ins with team members." },
  { id: 'e9', dimension: 'empathy', category: 'Building Connections', description: "Share something personal (appropriately) to encourage mutual trust." },
  { id: 'e10', dimension: 'empathy', category: 'Emotional Awareness', description: "Notice changes in a colleague's mood or energy levels." },

  // Accountability Activities
  { id: 'a1', dimension: 'accountability', category: 'Setting Clear Expectations', description: "Define specific, measurable goals for yourself and your team." },
  { id: 'a2', dimension: 'accountability', category: 'Setting Clear Expectations', description: "Break down large projects into smaller, actionable tasks with deadlines." },
  { id: 'a3', dimension: 'accountability', category: 'Setting Clear Expectations', description: "Communicate your role and responsibilities clearly to others." },
  { id: 'a4', dimension: 'accountability', category: 'Taking Ownership', description: "Admit mistakes immediately and take steps to correct them." },
  { id: 'a5', dimension: 'accountability', category: 'Taking Ownership', description: "Avoid blaming others when things go wrong—focus on solutions." },
  { id: 'a6', dimension: 'accountability', category: 'Taking Ownership', description: "Own both successes and failures as part of your journey." },
  { id: 'a7', dimension: 'accountability', category: 'Tracking Progress', description: "Keep a daily or weekly log of completed tasks and achievements." },
  { id: 'a8', dimension: 'accountability', category: 'Tracking Progress', description: "Share updates with your team to maintain transparency." },
  { id: 'a9', dimension: 'accountability', category: 'Building Trust', description: "Consistently meet or exceed expectations to build credibility." },
  { id: 'a10', dimension: 'accountability', category: 'Continuous Improvement', description: "Seek feedback regularly from peers, managers, and subordinates." },

  // Resiliency Activities
  { id: 'r1', dimension: 'resiliency', category: 'Mindset Shifts', description: "Reframe setbacks as opportunities to learn and grow." },
  { id: 'r2', dimension: 'resiliency', category: 'Mindset Shifts', description: "Practice gratitude by writing down three positive things each day." },
  { id: 'r3', dimension: 'resiliency', category: 'Mindset Shifts', description: "Focus on what you can control rather than worrying about external factors." },
  { id: 'r4', dimension: 'resiliency', category: 'Stress Management', description: "Take short breaks throughout the day to recharge." },
  { id: 'r5', dimension: 'resiliency', category: 'Stress Management', description: "Practice deep breathing exercises during stressful moments." },
  { id: 'r6', dimension: 'resiliency', category: 'Stress Management', description: "Incorporate mindfulness or meditation into your daily routine." },
  { id: 'r7', dimension: 'resiliency', category: 'Problem-Solving Skills', description: "Break overwhelming problems into smaller, manageable steps." },
  { id: 'r8', dimension: 'resiliency', category: 'Problem-Solving Skills', description: "Brainstorm multiple solutions before deciding on one." },
  { id: 'r9', dimension: 'resiliency', category: 'Emotional Regulation', description: "Label your emotions (e.g., \"I'm feeling frustrated\") to process them better." },
  { id: 'r10', dimension: 'resiliency', category: 'Support Systems & Community', description: "Build strong relationships with coworkers who uplift you." },

  // Transparency Activities
  { id: 't1', dimension: 'transparency', category: 'Open Communication', description: "Share updates regularly with your team, even if there's no major news." },
  { id: 't2', dimension: 'transparency', category: 'Open Communication', description: "Hold weekly check-ins to discuss progress, challenges, and goals." },
  { id: 't3', dimension: 'transparency', category: 'Open Communication', description: "Use clear, simple language instead of jargon or technical terms." },
  { id: 't4', dimension: 'transparency', category: 'Sharing Information', description: "Create a shared drive or platform where all relevant documents are accessible." },
  { id: 't5', dimension: 'transparency', category: 'Sharing Information', description: "Share both successes and setbacks openly with your team." },
  { id: 't6', dimension: 'transparency', category: 'Sharing Information', description: "Make performance metrics visible to promote accountability." },
  { id: 't7', dimension: 'transparency', category: 'Building Trust', description: "Follow through on promises and commitments consistently." },
  { id: 't8', dimension: 'transparency', category: 'Building Trust', description: "Apologize sincerely if you make a mistake or miscommunicate." },
  { id: 't9', dimension: 'transparency', category: 'Empowering Others', description: "Delegate tasks while providing full visibility into expectations." },
  { id: 't10', dimension: 'transparency', category: 'Continuous Improvement', description: "Conduct surveys to gauge how transparent employees feel the workplace is." },

  // Inclusivity Activities
  { id: 'i1', dimension: 'inclusivity', category: 'Building Awareness', description: "Educate yourself on diversity, equity, and inclusion (DEI) topics through books, articles, or podcasts." },
  { id: 'i2', dimension: 'inclusivity', category: 'Building Awareness', description: "Attend workshops or training sessions on unconscious bias and microaggressions." },
  { id: 'i3', dimension: 'inclusivity', category: 'Building Awareness', description: "Reflect on your own biases and how they might influence your behavior." },
  { id: 'i4', dimension: 'inclusivity', category: 'Creating Safe Spaces', description: "Encourage open discussions about inclusion and belonging." },
  { id: 'i5', dimension: 'inclusivity', category: 'Creating Safe Spaces', description: "Establish anonymous feedback channels for employees to voice concerns." },
  { id: 'i6', dimension: 'inclusivity', category: 'Creating Safe Spaces', description: "Host listening sessions to hear diverse perspectives and experiences." },
  { id: 'i7', dimension: 'inclusivity', category: 'Promoting Equity', description: "Review hiring practices to eliminate bias and ensure fairness." },
  { id: 'i8', dimension: 'inclusivity', category: 'Promoting Equity', description: "Offer mentorship programs that connect underrepresented employees with leaders." },
  { id: 'i9', dimension: 'inclusivity', category: 'Fostering Collaboration', description: "Pair employees from different departments or backgrounds for projects." },
  { id: 'i10', dimension: 'inclusivity', category: 'Leading by Example', description: "Model inclusive behavior in every interaction." },
];

const dimensionColors = {
  humility: 'bg-purple-100 text-purple-800 border-purple-200',
  empathy: 'bg-blue-100 text-blue-800 border-blue-200',
  accountability: 'bg-green-100 text-green-800 border-green-200',
  resiliency: 'bg-amber-100 text-amber-800 border-amber-200',
  transparency: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  inclusivity: 'bg-rose-100 text-rose-800 border-rose-200'
};

const dimensionTitles = {
  humility: 'Humility',
  empathy: 'Empathy',
  accountability: 'Accountability',
  resiliency: 'Resiliency',
  transparency: 'Transparency',
  inclusivity: 'Inclusivity'
};

const SkillDevelopment: React.FC<SkillDevelopmentProps> = ({ focusDimension }) => {
  const [activeDimension, setActiveDimension] = useState<HEARTIDimension | 'all'>(focusDimension || 'all');
  const [savedActivities, setSavedActivities] = useState<SavedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'explore' | 'saved'>('explore');
  
  useEffect(() => {
    loadSavedActivities();
  }, []);
  
  useEffect(() => {
    if (focusDimension) {
      setActiveDimension(focusDimension);
    }
  }, [focusDimension]);
  
  const loadSavedActivities = async () => {
    try {
      setLoading(true);
      
      // Get current user ID
      const userId = getOrCreateAnonymousId();
      
      // Try to load from localStorage first
      const storedActivities = localStorage.getItem('hearti-saved-activities');
      if (storedActivities) {
        setSavedActivities(JSON.parse(storedActivities));
      }
      
      // Try to fetch from Supabase if available
      try {
        const { data, error } = await supabase
          .from('saved_activities')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform data to match our SavedActivity interface
          const formattedActivities = data.map(activity => ({
            id: activity.id,
            userId: activity.user_id,
            activityId: activity.activity_id,
            dimension: activity.dimension as HEARTIDimension,
            completed: activity.completed,
            savedAt: activity.saved_at
          }));
          
          setSavedActivities(formattedActivities);
          // Save to localStorage as backup
          localStorage.setItem('hearti-saved-activities', JSON.stringify(formattedActivities));
        }
      } catch (e) {
        console.log('Error fetching from Supabase, using local storage', e);
      }
    } catch (error) {
      console.error('Error loading saved activities:', error);
      toast({
        title: "Error",
        description: "Could not load your saved activities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveActivity = async (activity: SkillActivity) => {
    try {
      const userId = getOrCreateAnonymousId();
      
      // Check if already saved
      if (savedActivities.some(saved => saved.activityId === activity.id)) {
        toast({
          title: "Already Saved",
          description: "This activity is already in your saved list",
        });
        return;
      }
      
      const newSavedActivity: SavedActivity = {
        userId,
        activityId: activity.id,
        dimension: activity.dimension,
        completed: false,
        savedAt: new Date().toISOString()
      };
      
      // Try to save to Supabase first
      try {
        const { data, error } = await supabase
          .from('saved_activities')
          .insert({
            user_id: userId,
            activity_id: activity.id,
            dimension: activity.dimension,
            completed: false,
            saved_at: newSavedActivity.savedAt
          })
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          newSavedActivity.id = data[0].id;
        }
      } catch (e) {
        console.log('Error saving to Supabase, will save to local storage only', e);
      }
      
      // Update local state
      const updatedSavedActivities = [...savedActivities, newSavedActivity];
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage as backup
      localStorage.setItem('hearti-saved-activities', JSON.stringify(updatedSavedActivities));
      
      toast({
        title: "Activity Saved",
        description: "The activity has been added to your saved list",
      });
    } catch (error) {
      console.error('Error saving activity:', error);
      toast({
        title: "Error",
        description: "Could not save the activity",
        variant: "destructive",
      });
    }
  };
  
  const toggleActivityCompletion = async (savedActivityId: string | undefined) => {
    if (!savedActivityId) return;
    
    try {
      // Update local state
      const updatedSavedActivities = savedActivities.map(activity => {
        if (activity.id === savedActivityId) {
          return { ...activity, completed: !activity.completed };
        }
        return activity;
      });
      
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage
      localStorage.setItem('hearti-saved-activities', JSON.stringify(updatedSavedActivities));
      
      // Try to update in Supabase
      const activityToUpdate = updatedSavedActivities.find(a => a.id === savedActivityId);
      
      if (activityToUpdate) {
        try {
          const { error } = await supabase
            .from('saved_activities')
            .update({ completed: activityToUpdate.completed })
            .eq('id', savedActivityId);
            
          if (error) throw error;
        } catch (e) {
          console.log('Error updating in Supabase, updated in local storage only', e);
        }
      }
    } catch (error) {
      console.error('Error toggling activity completion:', error);
      toast({
        title: "Error",
        description: "Could not update the activity",
        variant: "destructive",
      });
    }
  };
  
  const removeSavedActivity = async (savedActivityId: string | undefined) => {
    if (!savedActivityId) return;
    
    try {
      // Update local state
      const updatedSavedActivities = savedActivities.filter(
        activity => activity.id !== savedActivityId
      );
      
      setSavedActivities(updatedSavedActivities);
      
      // Save to localStorage
      localStorage.setItem('hearti-saved-activities', JSON.stringify(updatedSavedActivities));
      
      // Try to delete from Supabase
      try {
        const { error } = await supabase
          .from('saved_activities')
          .delete()
          .eq('id', savedActivityId);
          
        if (error) throw error;
      } catch (e) {
        console.log('Error deleting from Supabase, removed from local storage only', e);
      }
      
      toast({
        title: "Activity Removed",
        description: "The activity has been removed from your saved list",
      });
    } catch (error) {
      console.error('Error removing saved activity:', error);
      toast({
        title: "Error",
        description: "Could not remove the activity",
        variant: "destructive",
      });
    }
  };
  
  // Filter activities based on selected dimension
  const filteredActivities = activityData.filter(activity => 
    activeDimension === 'all' || activity.dimension === activeDimension
  );
  
  // Group activities by category
  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, SkillActivity[]>);
  
  // Filter saved activities based on selected dimension
  const filteredSavedActivities = savedActivities.filter(activity => 
    activeDimension === 'all' || activity.dimension === activeDimension
  );
  
  // Find the full activity details for a saved activity by ID
  const getActivityDetails = (activityId: string) => {
    return activityData.find(activity => activity.id === activityId);
  };
  
  return (
    <Card className="shadow-md border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Target className="text-indigo-600" size={24} />
          HEARTI Skill Development
        </CardTitle>
        <CardDescription>
          Improve your leadership dimensions with these targeted activities
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue={activeDimension} onValueChange={(value) => setActiveDimension(value as HEARTIDimension | 'all')}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <TabsList className="grid grid-cols-7 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="humility">Humility</TabsTrigger>
              <TabsTrigger value="empathy">Empathy</TabsTrigger>
              <TabsTrigger value="accountability">Account.</TabsTrigger>
              <TabsTrigger value="resiliency">Resiliency</TabsTrigger>
              <TabsTrigger value="transparency">Transp.</TabsTrigger>
              <TabsTrigger value="inclusivity">Inclusivity</TabsTrigger>
            </TabsList>
            
            <div className="p-1 inline-flex items-center justify-center rounded-lg bg-muted text-xs">
              <Button 
                size="sm" 
                variant={activeView === 'explore' ? "default" : "ghost"}
                className="rounded-md text-xs h-7"
                onClick={() => setActiveView('explore')}
              >
                Explore Activities
              </Button>
              <Button 
                size="sm" 
                variant={activeView === 'saved' ? "default" : "ghost"}
                className="rounded-md text-xs h-7"
                onClick={() => setActiveView('saved')}
              >
                My Activities ({savedActivities.length})
              </Button>
            </div>
          </div>
          
          {activeView === 'explore' ? (
            <div className="space-y-6">
              {Object.entries(groupedActivities).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No activities found for this dimension.</p>
                </div>
              ) : (
                Object.entries(groupedActivities).map(([category, activities]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-medium mb-3">{category}</h3>
                    <div className="grid gap-3">
                      {activities.map((activity) => (
                        <Card key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Badge className={`${dimensionColors[activity.dimension]} font-normal mr-2`}>
                                  {dimensionTitles[activity.dimension]}
                                </Badge>
                              </div>
                              <p className="text-sm">{activity.description}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2 flex items-center gap-1" 
                              onClick={() => saveActivity(activity)}
                              disabled={savedActivities.some(saved => saved.activityId === activity.id)}
                            >
                              <Bookmark size={16} />
                              {savedActivities.some(saved => saved.activityId === activity.id) ? 'Saved' : 'Save'}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <p className="mt-2">Loading your saved activities...</p>
                </div>
              ) : filteredSavedActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No saved activities found. Explore and save activities to see them here.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Award size={20} className="text-indigo-600" />
                    Your Saved Activities
                  </h3>
                  
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {filteredSavedActivities.map((savedActivity) => {
                        const activityDetails = getActivityDetails(savedActivity.activityId);
                        if (!activityDetails) return null;
                        
                        return (
                          <Card key={savedActivity.id} className={`p-4 border-l-4 ${savedActivity.completed ? 'border-l-green-500 bg-green-50' : 'border-l-blue-300'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <Badge className={`${dimensionColors[activityDetails.dimension]} font-normal mr-2`}>
                                    {dimensionTitles[activityDetails.dimension]}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {activityDetails.category}
                                  </span>
                                </div>
                                <p className="text-sm">{activityDetails.description}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant={savedActivity.completed ? "outline" : "default"}
                                  size="sm" 
                                  className="flex items-center gap-1" 
                                  onClick={() => toggleActivityCompletion(savedActivity.id)}
                                >
                                  {savedActivity.completed ? (
                                    <>
                                      <Check size={16} className="text-green-600" />
                                      Completed
                                    </>
                                  ) : (
                                    'Mark Complete'
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeSavedActivity(savedActivity.id)}
                                >
                                  <BookmarkCheck size={16} className="text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 text-sm text-muted-foreground rounded-b-lg">
        <p>Regularly practicing these activities will help you develop your HEARTI leadership dimensions.</p>
      </CardFooter>
    </Card>
  );
};

export default SkillDevelopment;
