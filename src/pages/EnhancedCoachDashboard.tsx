import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MessagingInterface } from '@/components/coach/MessagingInterface';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search,
  ArrowLeft,
  BarChart3,
  User,
  Calendar,
  MessageSquare,
  Bell,
  Eye
} from 'lucide-react';

interface ParticipantData {
  id: string;
  name: string;
  email: string;
  organization_id?: string;
  total_assessments: number;
  latest_overall_score?: number;
  latest_assessment_date?: string;
  progress_trend: 'up' | 'down' | 'stable' | 'new';
}

interface AssessmentDetail {
  id: string;
  date: string;
  overall_score: number;
  dimension_scores: Record<string, number>;
  answers: Record<string, any>;
  demographics?: Record<string, any>;
}

const EnhancedCoachDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendBulkHabitReminders } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantData | null>(null);
  const [participantDetails, setParticipantDetails] = useState<AssessmentDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'latest_score' | 'assessment_count'>('name');

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    if (user && !authLoading) {
      loadUserProfile();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (userProfile) {
      loadParticipants();
    }
  }, [userProfile]);

  const loadParticipants = async () => {
    try {
      setIsLoading(true);
      
      // Use the secure paginated assessments function for admin access
      const { data, error } = await supabase.rpc('get_secure_paginated_assessments', {
        page_offset: 0,
        page_limit: 1000,
        organization_filter: userProfile?.organization_id || null
      });

      if (error) {
        console.error('Error fetching assessments:', error);
        throw error;
      }

      // Get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, organization_id')
        .neq('role', 'admin');

      if (profilesError) throw profilesError;

      // Aggregate participant data
      const participantMap = new Map<string, ParticipantData>();
      
      profiles?.forEach(profile => {
        const userAssessments = data?.filter(a => a.user_id === profile.id) || [];
        const latestAssessment = userAssessments[0];
        
        // Calculate trend
        let trend: 'up' | 'down' | 'stable' | 'new' = 'new';
        if (userAssessments.length >= 2) {
          const recent = userAssessments.slice(0, 2);
          const diff = recent[0].overall_score - recent[1].overall_score;
          if (diff > 0.5) trend = 'up';
          else if (diff < -0.5) trend = 'down';
          else trend = 'stable';
        }

        participantMap.set(profile.id, {
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: profile.email,
          organization_id: profile.organization_id,
          total_assessments: userAssessments.length,
          latest_overall_score: latestAssessment?.overall_score,
          latest_assessment_date: latestAssessment?.date,
          progress_trend: trend
        });
      });

      setParticipants(Array.from(participantMap.values()));
    } catch (error) {
      console.error('Error loading participants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load participant data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadParticipantDetails = async (participant: ParticipantData) => {
    try {
      setSelectedParticipant(participant);
      
      const { data, error } = await supabase.rpc('get_user_assessments_secure', {
        target_user_id: participant.id,
        is_historical_user: false
      });

      if (error) {
        console.error('Error loading participant details:', error);
        throw error;
      }

      const details: AssessmentDetail[] = (data || []).map(assessment => ({
        id: assessment.id,
        date: assessment.date,
        overall_score: assessment.overall_score,
        dimension_scores: typeof assessment.dimension_scores === 'string' 
          ? JSON.parse(assessment.dimension_scores) 
          : assessment.dimension_scores,
        answers: typeof assessment.answers === 'string' 
          ? JSON.parse(assessment.answers) 
          : assessment.answers,
        demographics: assessment.demographics ? 
          (typeof assessment.demographics === 'string' 
            ? JSON.parse(assessment.demographics) 
            : assessment.demographics) 
          : undefined
      }));

      setParticipantDetails(details);
    } catch (error) {
      console.error('Error loading participant details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load participant details',
        variant: 'destructive'
      });
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-blue-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'bg-green-100 text-green-800';
      case 'down': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sendHabitReminders = async () => {
    try {
      const count = await sendBulkHabitReminders();
      toast({
        title: 'Reminders sent',
        description: `Sent habit tracker reminders to ${count} users`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reminders',
        variant: 'destructive'
      });
    }
  };

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageScore = participants.length > 0 
    ? participants
        .filter(p => p.latest_overall_score !== undefined)
        .reduce((sum, p) => sum + (p.latest_overall_score || 0), 0) / 
      participants.filter(p => p.latest_overall_score !== undefined).length
    : 0;

  const totalAssessments = participants.reduce((sum, p) => sum + p.total_assessments, 0);
  const improvingParticipants = participants.filter(p => p.progress_trend === 'up').length;

  // Redirect if not admin
  if (!authLoading && (!user || !['admin', 'super_admin'].includes(userProfile?.role || ''))) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert>
          <AlertDescription>
            Access denied. You need admin privileges to view this dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coach Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor participant progress, send messages, and manage notifications
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{participants.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active users in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssessments}</div>
                <p className="text-xs text-muted-foreground">
                  Completed assessments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all latest assessments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Improving</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{improvingParticipants}</div>
                <p className="text-xs text-muted-foreground">
                  Participants trending upward
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredParticipants.map((participant) => (
              <Card key={participant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{participant.name}</h3>
                        <p className="text-sm text-muted-foreground">{participant.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {participant.latest_overall_score?.toFixed(1) || '-'}
                        </div>
                        <div className="text-xs text-muted-foreground">Latest Score</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold">{participant.total_assessments}</div>
                        <div className="text-xs text-muted-foreground">Assessments</div>
                      </div>
                      
                      <Badge className={getTrendColor(participant.progress_trend)}>
                        {getTrendIcon(participant.progress_trend)}
                        <span className="ml-1 capitalize">{participant.progress_trend}</span>
                      </Badge>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadParticipantDetails(participant)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredParticipants.length === 0 && (
            <Alert>
              <AlertDescription>
                No participants found matching your search criteria.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {selectedParticipant ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Details - {selectedParticipant.name}</CardTitle>
                  <CardDescription>
                    Detailed view of individual assessment responses and scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {participantDetails.map((assessment) => (
                      <Card key={assessment.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">
                                {new Date(assessment.date).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge variant="secondary">
                              Overall Score: {assessment.overall_score.toFixed(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Dimension Scores</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(assessment.dimension_scores).map(([dimension, score]) => (
                                  <div key={dimension} className="flex justify-between">
                                    <span className="text-sm capitalize">{dimension.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="font-medium">{score.toFixed(1)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Question Responses</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {Object.entries(assessment.answers).map(([question, answer]) => (
                                  <div key={question} className="text-sm">
                                    <span className="font-medium">Q{question}: </span>
                                    <span>{answer}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Select a participant from the Participants tab to view their detailed assessment history.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="messaging" className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Messaging Center</h2>
          </div>
          <MessagingInterface />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Notifications</h2>
            </div>
            <Button onClick={sendHabitReminders}>
              <Bell className="h-4 w-4 mr-2" />
              Send Habit Reminders
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Notification Management</CardTitle>
              <CardDescription>
                Send reminders and notifications to help users stay on track with their habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Bell className="h-4 w-4" />
                  <AlertDescription>
                    Click "Send Habit Reminders" to send notification reminders to all users to check their habit tracker.
                    Users will see these notifications in their main app interface.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCoachDashboard;