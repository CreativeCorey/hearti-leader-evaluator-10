
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

const GoogleIntegrationTools: React.FC<GoogleIntegrationToolsProps> = () => {
  // Component always returns null to hide it
  return null;
};

export default GoogleIntegrationTools;
