
import React from 'react';

const GoogleTroubleshooting: React.FC = () => {
  return (
    <div className="mt-6 p-6 border rounded-md bg-blue-50">
      <h3 className="text-lg font-semibold mb-2">Troubleshooting Google OAuth</h3>
      <p className="mb-4">If you're seeing a 403 error when connecting to Google, please ensure:</p>
      
      <ol className="list-decimal pl-6 space-y-2 mb-4">
        <li>
          <strong>Your Google Cloud Project is properly configured:</strong> 
          <ul className="list-disc pl-6 mt-1">
            <li>OAuth consent screen is set up</li>
            <li>Web application OAuth client is created</li>
            <li>The correct redirect URL is added to allowed redirect URLs</li>
          </ul>
        </li>
        <li>
          <strong>Redirect URL is properly configured:</strong> Add this URL to your authorized redirect URIs in Google Cloud Console:
          <div className="p-2 bg-white border rounded mt-1 font-mono text-sm break-all">
            {`${window.location.origin}/auth/callback`}
          </div>
        </li>
        <li>
          <strong>JavaScript origins are set:</strong> Add this URL to your authorized JavaScript origins:
          <div className="p-2 bg-white border rounded mt-1 font-mono text-sm">
            {window.location.origin}
          </div>
        </li>
        <li>
          <strong>OAuth Client ID and Secret are correctly added to Supabase</strong>
        </li>
      </ol>
      
      <p className="text-sm text-muted-foreground">
        For more details, see the <a href="https://supabase.com/docs/guides/auth/social-login/auth-google" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Google Auth documentation</a>.
      </p>
    </div>
  );
};

export default GoogleTroubleshooting;
