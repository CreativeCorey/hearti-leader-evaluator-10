
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface GoogleSheetsSetupProps {
  googleConnection: { connected: boolean; email?: string };
  handleGoogleSignIn: () => void;
  handleConfigureWorkloadIdentity: () => void;
  configuringWorkloadIdentity: boolean;
  testGoogleSheets: () => void;
  testingSheets: boolean;
}

const GoogleSheetsSetup: React.FC<GoogleSheetsSetupProps> = ({
  googleConnection,
  handleGoogleSignIn,
  handleConfigureWorkloadIdentity,
  configuringWorkloadIdentity,
  testGoogleSheets,
  testingSheets
}) => {
  return (
    <div className="mt-12 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Google Sheets Integration</h2>
      <Card>
        <CardHeader>
          <CardTitle>Connect with Google</CardTitle>
          <CardDescription>
            Configure Google Sheets integration using workload identity federation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step 1: Connect Google Account */}
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Step 1: Connect your Google Account</h3>
              {googleConnection.connected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                  <span>Connected as {googleConnection.email}</span>
                </div>
              ) : (
                <Button onClick={handleGoogleSignIn}>
                  Sign in with Google
                </Button>
              )}
            </div>
            
            {/* Step 2: Configure Workload Identity */}
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Step 2: Setup Workload Identity</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure workload identity federation to securely connect to Google Sheets
              </p>
              <Button 
                onClick={handleConfigureWorkloadIdentity}
                disabled={!googleConnection.connected || configuringWorkloadIdentity}
                className="flex items-center gap-2"
              >
                {configuringWorkloadIdentity && <Loader2 className="h-4 w-4 animate-spin" />}
                Configure Workload Identity
              </Button>
            </div>
            
            {/* Step 3: Test Connection */}
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Step 3: Test Google Sheets Connection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Test your connection to make sure it's working correctly
              </p>
              <Button 
                onClick={testGoogleSheets}
                disabled={testingSheets}
                variant="outline"
                className="flex items-center gap-2"
              >
                {testingSheets && <Loader2 className="h-4 w-4 animate-spin" />}
                Test Connection
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            For more information about Google Sheets integration and workload identity federation, refer to the documentation.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoogleSheetsSetup;
