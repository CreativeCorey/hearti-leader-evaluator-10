
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GoogleIntegrationToolsProps {
  testGoogleSheets: () => void;
  testingSheets?: boolean;
  hasLatestAssessment?: boolean;
  isCloudEnabled?: boolean;
  onToggleCloud?: (enabled: boolean) => void;
  onSyncToSheets?: () => Promise<void>;
  onSignIn?: () => Promise<void>;
  onConfigureWorkloadIdentity?: () => Promise<void>;
  onTestConnection?: () => Promise<void>;
  connectionStatus?: {
    status: 'connected' | 'disconnected';
    email?: string;
  };
}

const GoogleIntegrationTools: React.FC<GoogleIntegrationToolsProps> = ({
  testGoogleSheets,
  testingSheets = false
}) => {
  // Component is now hidden by default, and only shown for development
  return null;
  
  /* Original implementation - kept for reference but not used
  return (
    <div className="mt-12 border-t pt-4">
      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-muted-foreground">
          Google Sheets Integration Tools
        </summary>
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="mb-4 text-sm text-muted-foreground">
            These tools help diagnose issues with Google Sheets integration. The test will attempt to send
            sample data directly to Google Sheets.
          </p>
          <Button 
            onClick={testGoogleSheets}
            disabled={testingSheets}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {testingSheets && <Loader2 className="h-4 w-4 animate-spin" />}
            Test Google Sheets Connection
          </Button>
        </div>
      </details>
    </div>
  );
  */
};

export default GoogleIntegrationTools;
