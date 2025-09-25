import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BarChart3, FileText, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Assessment {
  id: string;
  date: string;
  overall_score: number;
  dimension_scores: {
    humility: number;
    empathy: number;
    accountability: number;
    resiliency: number;
    transparency: number;
    inclusivity: number;
  };
  answers: number[];
  demographics?: any;
  email: string;
}

interface UserAssessmentDetailsProps {
  userId: string;
  userName: string;
  userEmail: string;
  isHistorical: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserAssessmentDetails = ({ 
  userId, 
  userName, 
  userEmail, 
  isHistorical, 
  open, 
  onOpenChange 
}: UserAssessmentDetailsProps) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      loadAssessments();
    }
  }, [open, userId]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      
      // Use the secure function to get user assessments with proper admin permissions
      const { data, error } = await supabase.rpc('get_user_assessments_secure', {
        target_user_id: userId,
        is_historical_user: isHistorical
      });

      if (error) {
        console.error('RPC Error loading assessments:', error);
        throw error;
      }

      // Parse and type the assessments data
      const typedAssessments: Assessment[] = (data || []).map(item => ({
        id: item.id,
        date: item.date,
        overall_score: item.overall_score,
        dimension_scores: typeof item.dimension_scores === 'object' && item.dimension_scores 
          ? item.dimension_scores as any 
          : { humility: 3, empathy: 3, accountability: 3, resiliency: 3, transparency: 3, inclusivity: 3 },
        answers: Array.isArray(item.answers) ? item.answers as number[] : [],
        demographics: item.demographics,
        email: item.email || ''
      }));

      console.log(`Loaded ${typedAssessments.length} assessments for user ${userId} (historical: ${isHistorical})`);
      setAssessments(typedAssessments);
    } catch (error) {
      console.error('Error loading assessments:', error);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDimensionColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const dimensionLabels = {
    humility: 'Humility',
    empathy: 'Empathy', 
    accountability: 'Accountability',
    resiliency: 'Resiliency',
    transparency: 'Transparency',
    inclusivity: 'Inclusivity'
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Assessment Data...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Assessment Data: {userName || userEmail}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={isHistorical ? "outline" : "default"}>
              {isHistorical ? "Historical User" : "Active User"}
            </Badge>
            <span>•</span>
            <span>{assessments.length} assessment(s) found</span>
          </div>
        </DialogHeader>

        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {loading ? "Loading assessments..." : "No assessments found for this user."}
            </p>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-2">
                This user may not have completed any assessments yet, or you may not have permission to view their data.
              </p>
            )}
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dimensions">Dimension Scores</TabsTrigger>
              <TabsTrigger value="answers">Question Answers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assessments.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Latest Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {assessments[0]?.overall_score.toFixed(1) || 'N/A'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {assessments.length > 0 
                        ? (assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length).toFixed(1)
                        : 'N/A'
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Overall Score</TableHead>
                        <TableHead>Dimensions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assessments.map((assessment) => (
                        <TableRow key={assessment.id}>
                          <TableCell>{formatDate(assessment.date)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getDimensionColor(assessment.overall_score)}>
                              {assessment.overall_score.toFixed(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(assessment.dimension_scores).slice(0, 3).map(([key, value]) => (
                                <Badge key={key} variant="secondary" className="text-xs">
                                  {key.slice(0, 3)}: {value.toFixed(1)}
                                </Badge>
                              ))}
                              {Object.keys(assessment.dimension_scores).length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{Object.keys(assessment.dimension_scores).length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-4">
              {assessments.map((assessment, index) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Assessment {index + 1} - {formatDate(assessment.date)}
                    </CardTitle>
                    <CardDescription>
                      Overall Score: {assessment.overall_score.toFixed(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(assessment.dimension_scores).map(([dimension, score]) => (
                        <div key={dimension} className="text-center p-4 border rounded-lg">
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            {dimensionLabels[dimension as keyof typeof dimensionLabels]}
                          </div>
                          <div className={`text-2xl font-bold ${getDimensionColor(score)}`}>
                            {score.toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="answers" className="space-y-4">
              {assessments.map((assessment, index) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question Answers - Assessment {index + 1}
                    </CardTitle>
                    <CardDescription>
                      {formatDate(assessment.date)} • {assessment.answers.length} questions answered
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {assessment.answers.map((answer, qIndex) => (
                        <div key={qIndex} className="text-center p-2 border rounded">
                          <div className="text-xs text-muted-foreground">Q{qIndex + 1}</div>
                          <div className={`font-bold ${getDimensionColor(answer)}`}>
                            {answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserAssessmentDetails;