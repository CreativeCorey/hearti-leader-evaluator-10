import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Calendar,
  Eye,
  MessageSquare,
  BarChart3,
  Filter
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ParticipantData {
  id: string;
  name: string;
  email: string;
  organization_name?: string;
  latest_assessment_date?: string;
  total_assessments: number;
  latest_overall_score?: number;
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

const CoachDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantData | null>(null);
  const [assessmentDetails, setAssessmentDetails] = useState<AssessmentDetail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role, organization_id')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    loadProfile();
  }, [user]);

  // Redirect if not coach or admin
  if (!user || !['coach', 'admin'].includes(profile?.role || '')) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      setLoading(true);
      
      // Get organization assessments if coach has an organization
      let query = supabase
        .from('assessments')
        .select(`
          user_id,
          date,
          overall_score,
          profiles!inner(
            id,
            name,
            email,
            organization_id,
            organizations(name)
          )
        `)
        .order('date', { ascending: false });

      // If coach (not admin), filter by organization
      if (profile?.role === 'coach' && profile.organization_id) {
        query = query.eq('profiles.organization_id', profile.organization_id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Process data to get participant summaries
      const participantMap = new Map<string, any>();
      
      data?.forEach((assessment: any) => {
        const userId = assessment.user_id;
        const profile = assessment.profiles;
        
        if (!participantMap.has(userId)) {
          participantMap.set(userId, {
            id: userId,
            name: profile.name || 'Unknown',
            email: profile.email,
            organization_name: profile.organizations?.name,
            assessments: [],
            total_assessments: 0,
            latest_assessment_date: null,
            latest_overall_score: null,
            progress_trend: 'new' as const
          });
        }
        
        const participant = participantMap.get(userId);
        participant.assessments.push({
          date: assessment.date,
          overall_score: assessment.overall_score
        });
        participant.total_assessments++;
        
        // Update latest assessment info
        if (!participant.latest_assessment_date || assessment.date > participant.latest_assessment_date) {
          participant.latest_assessment_date = assessment.date;
          participant.latest_overall_score = assessment.overall_score;
        }
      });

      // Calculate progress trends
      const participantList = Array.from(participantMap.values()).map(p => {
        // Sort assessments by date
        p.assessments.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // Determine trend
        if (p.assessments.length >= 2) {
          const recent = p.assessments.slice(-2);
          const diff = recent[1].overall_score - recent[0].overall_score;
          if (diff > 0.5) p.progress_trend = 'up';
          else if (diff < -0.5) p.progress_trend = 'down';
          else p.progress_trend = 'stable';
        }
        
        return p;
      });

      setParticipants(participantList);
    } catch (error) {
      console.error('Error loading participants:', error);
      toast({
        title: "Error",
        description: "Failed to load participant data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadParticipantDetails = async (participant: ParticipantData) => {
    try {
      setLoadingDetails(true);
      setSelectedParticipant(participant);

      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', participant.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      setAssessmentDetails((data || []).map(item => ({
        id: item.id,
        date: item.date,
        overall_score: item.overall_score,
        dimension_scores: typeof item.dimension_scores === 'string' 
          ? JSON.parse(item.dimension_scores) 
          : item.dimension_scores as Record<string, number>,
        answers: typeof item.answers === 'string' 
          ? JSON.parse(item.answers)
          : item.answers as Record<string, any>,
        demographics: item.demographics ? 
          (typeof item.demographics === 'string' 
            ? JSON.parse(item.demographics)
            : item.demographics as Record<string, any>
          ) : undefined
      })));
    } catch (error) {
      console.error('Error loading participant details:', error);
      toast({
        title: "Error",
        description: "Failed to load participant details.",
        variant: "destructive"
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
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

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.organization_name && p.organization_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Coach Dashboard</h1>
            <p className="text-muted-foreground">Monitor participant progress and insights</p>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            {selectedParticipant && (
              <TabsTrigger value="details">
                {selectedParticipant.name} Details
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{participants.length}</div>
                  <p className="text-xs text-muted-foreground">Active participants</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {participants.reduce((sum, p) => sum + p.total_assessments, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Completed assessments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {participants.length > 0 
                      ? (participants
                          .filter(p => p.latest_overall_score !== null)
                          .reduce((sum, p) => sum + (p.latest_overall_score || 0), 0) / 
                         participants.filter(p => p.latest_overall_score !== null).length
                        ).toFixed(1)
                      : '-'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Latest scores</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Improving</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {participants.filter(p => p.progress_trend === 'up').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Participants trending up</p>
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
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredParticipants.map((participant) => (
                <Card key={participant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{participant.name}</h3>
                          <p className="text-sm text-muted-foreground">{participant.email}</p>
                          {participant.organization_name && (
                            <p className="text-xs text-muted-foreground">{participant.organization_name}</p>
                          )}
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
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getTrendColor(participant.progress_trend)}>
                            {getTrendIcon(participant.progress_trend)}
                            <span className="ml-1 capitalize">{participant.progress_trend}</span>
                          </Badge>
                        </div>
                        
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

          {selectedParticipant && (
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Participant Overview</CardTitle>
                  <CardDescription>
                    Detailed assessment history for {selectedParticipant.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingDetails ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assessmentDetails.map((assessment) => (
                        <Card key={assessment.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {format(new Date(assessment.date), 'PPP')}
                                </span>
                              </div>
                              <Badge variant="secondary">
                                Score: {assessment.overall_score.toFixed(1)}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                              {Object.entries(assessment.dimension_scores).map(([dimension, score]) => (
                                <div key={dimension} className="text-center">
                                  <div className="font-medium">{(score as number).toFixed(1)}</div>
                                  <div className="text-xs text-muted-foreground capitalize">
                                    {dimension}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default CoachDashboard;