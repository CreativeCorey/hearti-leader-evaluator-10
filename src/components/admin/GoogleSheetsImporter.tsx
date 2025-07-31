import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportResult {
  success: boolean;
  imported?: {
    profiles: number;
    assessments: number;
  };
  errors?: string[];
  totalRows?: number;
  error?: string;
}

const GoogleSheetsImporter: React.FC = () => {
  const { toast } = useToast();
  const [sheetId, setSheetId] = useState('');
  const [range, setRange] = useState('Sheet1!A:Z');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    if (!sheetId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheets ID",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      toast({
        title: "Starting Import",
        description: "Reading data from Google Sheets...",
      });

      const { data, error } = await supabase.functions.invoke('import-google-sheets-data', {
        body: {
          sheetId: sheetId.trim(),
          range: range.trim(),
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      setImportResult(data);

      if (data.success) {
        toast({
          title: "Import Complete",
          description: `Imported ${data.imported.profiles} profiles and ${data.imported.assessments} assessments`,
        });
      } else {
        toast({
          title: "Import Failed",
          description: data.error,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Import error:", error);
      setImportResult({
        success: false,
        error: error.message,
      });
      
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const extractSheetId = (url: string): string => {
    // Extract sheet ID from Google Sheets URL
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleSheetIdChange = (value: string) => {
    const extractedId = extractSheetId(value);
    setSheetId(extractedId);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Google Sheets Import
        </CardTitle>
        <CardDescription>
          Import historical assessment data from Google Sheets. Data will be marked as historical and matched by email and unique ID.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheetId">Google Sheets ID or URL</Label>
            <Input
              id="sheetId"
              placeholder="Enter Google Sheets ID or paste the full URL"
              value={sheetId}
              onChange={(e) => handleSheetIdChange(e.target.value)}
              disabled={isImporting}
            />
            <p className="text-sm text-muted-foreground">
              You can paste either the full Google Sheets URL or just the sheet ID
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="range">Sheet Range (optional)</Label>
            <Input
              id="range"
              placeholder="e.g., Sheet1!A:Z"
              value={range}
              onChange={(e) => setRange(e.target.value)}
              disabled={isImporting}
            />
            <p className="text-sm text-muted-foreground">
              Specify the range to import. Default: Sheet1!A:Z
            </p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Before importing:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Ensure the Google Sheet is accessible with your configured service account</li>
              <li>• Historical data will be marked with isHistorical: true in demographics</li>
              <li>• Users will be matched by email and unique ID</li>
              <li>• New profiles will be created for non-existing users</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleImport} 
          disabled={isImporting || !sheetId.trim()}
          className="w-full"
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing Data...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import Historical Data
            </>
          )}
        </Button>

        {importResult && (
          <Card className={importResult.success ? "border-green-200" : "border-red-200"}>
            <CardHeader className="pb-3">
              <CardTitle className={`flex items-center gap-2 text-sm ${
                importResult.success ? "text-green-700" : "text-red-700"
              }`}>
                {importResult.success ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Import Successful
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Import Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {importResult.success && importResult.imported && (
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Imported:</strong>
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• {importResult.imported.profiles} new user profiles</li>
                    <li>• {importResult.imported.assessments} historical assessments</li>
                    <li>• Total rows processed: {importResult.totalRows}</li>
                  </ul>
                </div>
              )}

              {importResult.error && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-700">Error:</p>
                  <p className="text-sm text-red-600">{importResult.error}</p>
                </div>
              )}

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-amber-700">
                    Warnings ({importResult.errors.length}):
                  </p>
                  <div className="max-h-32 overflow-y-auto">
                    <ul className="text-sm space-y-1 text-amber-600">
                      {importResult.errors.slice(0, 10).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {importResult.errors.length > 10 && (
                        <li>• ... and {importResult.errors.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsImporter;