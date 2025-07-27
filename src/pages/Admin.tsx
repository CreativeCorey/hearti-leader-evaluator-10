import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, Users, Database } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ImportResult {
  successful: number;
  failed: number;
  errors: string[];
}

const Admin = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();
  const [csvData, setCsvData] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    loadProfile();
  }, [user]);

  // Redirect if not admin
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvData(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
    }
  };

  const parseCSVData = (csv: string) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const assessments = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const assessment: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header.toLowerCase()) {
          case 'user_email':
          case 'email':
            assessment.user_email = value;
            break;
          case 'user_name':
          case 'name':
            assessment.user_name = value;
            break;
          case 'organization_name':
          case 'organization':
            assessment.organization_name = value;
            break;
          case 'assessment_date':
          case 'date':
            assessment.assessment_date = value;
            break;
          case 'overall_score':
            assessment.overall_score = parseFloat(value) || 0;
            break;
          case 'answers':
            try {
              assessment.answers = JSON.parse(value);
            } catch {
              assessment.answers = {};
            }
            break;
          case 'dimension_scores':
            try {
              assessment.dimension_scores = JSON.parse(value);
            } catch {
              assessment.dimension_scores = {};
            }
            break;
          case 'demographics':
            try {
              assessment.demographics = value ? JSON.parse(value) : null;
            } catch {
              assessment.demographics = null;
            }
            break;
        }
      });
      
      assessments.push(assessment);
    }
    
    return assessments;
  };

  const handleBulkImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "No Data",
        description: "Please upload a CSV file or paste CSV data.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setImportResult(null);

    try {
      const assessments = parseCSVData(csvData);
      
      if (assessments.length === 0) {
        throw new Error('No valid assessments found in CSV data');
      }

      setUploadProgress(25);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      setUploadProgress(50);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bulk-import-assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ assessments }),
      });

      setUploadProgress(75);

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setUploadProgress(100);
      setImportResult(result);

      toast({
        title: "Import Complete",
        description: `Successfully imported ${result.successful} assessments. ${result.failed} failed.`,
      });

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "An error occurred during import.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage system data and bulk imports</p>
          </div>
        </div>

        <Separator />

        {/* Bulk Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Import Assessments
            </CardTitle>
            <CardDescription>
              Upload historical assessment data via CSV file or paste CSV data directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload CSV File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Expected CSV format:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                user_email,user_name,organization_name,assessment_date,overall_score,answers,dimension_scores,demographics
              </code>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Or Paste CSV Data</label>
              <Textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Paste your CSV data here..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing assessments...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {importResult && (
              <Alert className={importResult.failed > 0 ? "border-yellow-500" : "border-green-500"}>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Import Results:</strong></p>
                    <p>✅ Successful: {importResult.successful}</p>
                    <p>❌ Failed: {importResult.failed}</p>
                    {importResult.errors.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">View Errors</summary>
                        <ul className="mt-2 space-y-1 text-xs">
                          {importResult.errors.map((error, index) => (
                            <li key={index} className="text-red-600">• {error}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleBulkImport}
              disabled={isUploading || !csvData.trim()}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Assessments
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Active profiles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Active orgs</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;