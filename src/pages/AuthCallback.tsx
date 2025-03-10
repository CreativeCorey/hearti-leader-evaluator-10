
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const debug: Record<string, any> = {
        url: window.location.href,
        hash: location.hash,
        search: location.search,
        timestamp: new Date().toISOString()
      };
      
      try {
        // Log the current URL to help with debugging
        console.log('Auth callback URL:', window.location.href);
        
        // Check if we have a code in the URL
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        const errorParam = queryParams.get('error');
        const errorDescription = queryParams.get('error_description');
        
        // Update debug information
        debug.has_code = !!code;
        debug.error_param = errorParam;
        debug.error_description = errorDescription;
        
        // If we have an error, display it
        if (errorParam || errorDescription) {
          console.error('OAuth error:', errorDescription || errorParam);
          setError(`Authentication failed: ${errorDescription || errorParam}`);
          return;
        }
        
        // Extract access token from URL hash for direct token handling
        let accessToken = null;
        let refreshToken = null;
        
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          accessToken = hashParams.get('access_token');
          refreshToken = hashParams.get('refresh_token');
          
          debug.has_access_token = !!accessToken;
          debug.has_refresh_token = !!refreshToken;
        }
        
        // If we have a code, let Supabase handle the exchange
        if (code) {
          console.log('Found authorization code in URL, exchanging for tokens');
          debug.attempting = 'exchange_code';
          
          try {
            // Let Supabase handle the token exchange automatically
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            debug.exchange_result = error ? 'error' : 'success';
            debug.exchange_error = error?.message;
            
            if (error) {
              console.error('Error exchanging code for session:', error);
              setError(`Authentication failed: ${error.message}`);
              return;
            }
            
            if (data.session) {
              debug.session_created = true;
              debug.user_id = data.session.user.id;
              debug.provider = data.session.user.app_metadata.provider;
              
              console.log('Successfully authenticated user', {
                user: data.session.user.id,
                email: data.session.user.email,
                provider: data.session.user.app_metadata.provider
              });
              
              toast({
                title: 'Authentication successful',
                description: 'You have been successfully signed in.',
              });
              
              // Make sure we're redirecting to the app's origin
              const appOrigin = window.location.origin;
              const redirectPath = '/';
              
              // Use React Router to navigate to the home page
              navigate(redirectPath);
              return;
            }
          } catch (exchangeError) {
            console.error('Exception during code exchange:', exchangeError);
            debug.exchange_exception = String(exchangeError);
            setError(`Error during authentication: ${exchangeError instanceof Error ? exchangeError.message : String(exchangeError)}`);
            return;
          }
        } 
        // Try to use access token directly if present in hash 
        else if (accessToken && refreshToken) {
          debug.attempting = 'hash_token';
          console.log('Found access token in URL hash, setting session');
          
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            debug.session_result = error ? 'error' : 'success';
            debug.session_error = error?.message;
            
            if (error) {
              console.error('Error setting session from hash:', error);
              setError(`Authentication failed: ${error.message}`);
              return;
            }
            
            toast({
              title: 'Authentication successful',
              description: 'You have been successfully signed in.',
            });
            
            // Navigate to the home page if successful
            navigate('/');
            return;
          } catch (sessionError) {
            console.error('Exception during session setting:', sessionError);
            debug.session_exception = String(sessionError);
            setError(`Error setting session: ${sessionError instanceof Error ? sessionError.message : String(sessionError)}`);
            return;
          }
        } 
        // If no code or token was found, but we're at the callback URL
        else {
          debug.attempting = 'get_session';
          console.warn('No authorization code or token found in callback URL');
          // Try to retrieve session anyway, might be stored in cookies/localStorage
          try {
            const { data, error } = await supabase.auth.getSession();
            
            debug.get_session = error ? 'error' : 'success';
            debug.get_session_error = error?.message;
            debug.has_session = !!data?.session;
            
            if (error) {
              console.error('Failed to get session:', error);
              setError('Authentication failed: No authorization code or token found');
              return;
            }
            
            if (!data.session) {
              console.error('No session found after callback');
              setError('Authentication failed: No session established');
              return;
            }
            
            // If we have a session, redirect to home
            navigate('/');
            return;
          } catch (sessionError) {
            console.error('Exception during session retrieval:', sessionError);
            debug.get_session_exception = String(sessionError);
            setError(`Error getting session: ${sessionError instanceof Error ? sessionError.message : String(sessionError)}`);
            return;
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        debug.global_exception = String(err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setDebugInfo(debug);
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [location, navigate, toast]);

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
            <p>If the problem persists, please try signing in with email and password instead.</p>
            {debugInfo && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer font-medium">Debug Information</summary>
                <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If we reach here, authentication was successful but not redirected
  return <Navigate to="/" replace />;
};

export default AuthCallback;
