
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log the current URL to help with debugging
        console.log('Auth callback URL:', window.location.href);
        
        // The hash contains the token
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          console.log('Found access token in URL, setting session');
          // If we have an access_token in the URL, we can set the session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });
          
          if (error) {
            console.error('Error setting session:', error);
            setError(`Authentication failed: ${error.message}`);
          }
        } else if (location.search) {
          // Handle any error in the URL parameters
          const queryParams = new URLSearchParams(location.search);
          const errorDescription = queryParams.get('error_description');
          
          if (errorDescription) {
            console.error('OAuth error:', errorDescription);
            setError(`Authentication failed: ${errorDescription}`);
          } else {
            // Let Supabase handle the callback
            const { error } = await supabase.auth.getSession();
            if (error) {
              console.error('Session error:', error);
              setError(`Authentication failed: ${error.message}`);
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [location]);

  if (processing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <h1 className="mt-4 text-xl font-semibold">Processing authentication...</h1>
          <p className="mt-2 text-sm text-gray-500">Please wait while we complete your sign-in.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md p-6 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Authentication Error</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-6">
            <a 
              href="/"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Return to Home
            </a>
          </div>
          <div className="mt-8 border-t pt-6 text-sm text-gray-500">
            <p>If the problem persists, please check your Google OAuth configuration.</p>
          </div>
        </div>
      </div>
    );
  }

  // If we reach here, authentication was successful
  return <Navigate to="/" replace />;
};

export default AuthCallback;
