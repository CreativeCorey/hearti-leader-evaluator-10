import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { bulkImportData, importFromJSON, createSampleImportData } from '@/utils/bulkImport';
import { Upload, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleSheetsImporter from '@/components/admin/GoogleSheetsImporter';

const DataImporter = () => {
  const [importData, setImportData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!importData.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON data to import",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await importFromJSON(importData);
      setLastResult(result);
      
      if (result.success) {
        toast({
          title: "Import Successful",
          description: `Imported ${result.usersImported} users and ${result.assessmentsImported} assessments`
        });
        setImportData(''); // Clear data after successful import
      } else {
        toast({
          title: "Import Failed",
          description: `${result.errors.length} errors occurred during import`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = createSampleImportData();
    setImportData(JSON.stringify(sampleData, null, 2));
  };

  const downloadTemplate = () => {
    const template = createSampleImportData();
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Tabs defaultValue="google-sheets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google-sheets">Google Sheets Import</TabsTrigger>
          <TabsTrigger value="json">JSON Import</TabsTrigger>
        </TabsList>

        <TabsContent value="google-sheets">
          <GoogleSheetsImporter />
        </TabsContent>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Historical Data Import (JSON)
              </CardTitle>
              <CardDescription>
                Import historical user profiles and assessment data into the database.
                Data should be in JSON format with users and assessments arrays.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={loadSampleData}
                  className="flex items-center gap-2"
                >
                  Load Sample Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={downloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>
              
              <Textarea
                placeholder="Paste your JSON data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              
              <Button 
                onClick={handleImport}
                disabled={isLoading || !importData.trim()}
                className="w-full"
              >
                {isLoading ? 'Importing...' : 'Import Data'}
              </Button>
            </CardContent>
          </Card>

          {lastResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {lastResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Users Imported:</span> {lastResult.usersImported}
                  </div>
                  <div>
                    <span className="font-medium">Assessments Imported:</span> {lastResult.assessmentsImported}
                  </div>
                </div>
                
                {lastResult.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="font-medium">{lastResult.errors.length} errors occurred:</div>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {lastResult.errors.slice(0, 5).map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                          {lastResult.errors.length > 5 && (
                            <li>... and {lastResult.errors.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Data Format Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "users": [
    {
      "id": "user-uuid-here",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user",
      "organizationId": "org-uuid-here",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "assessments": [
    {
      "id": "assessment-uuid-here",
      "userId": "user-uuid-here",
      "date": "2024-01-01T00:00:00.000Z",
      "answers": [...],
      "dimensionScores": {
        "humility": 85,
        "empathy": 90,
        "accountability": 78,
        "resiliency": 82,
        "transparency": 88,
        "inclusivity": 91
      },
      "overallScore": 85.7,
      "demographics": {
        "managementLevel": "middle",
        "companySize": "100-500",
        "jobRole": "manager"
      }
    }
  ]
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImporter;