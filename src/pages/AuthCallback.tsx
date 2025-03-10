
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Get the URL hash and parse it
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check if this is a password recovery flow
        const isRecovery = queryParams.get('type') === 'recovery';
        
        // Log more details for debugging
        console.log('Auth callback URL:', window.location.href);
        console.log('Is recovery flow:', isRecovery);
        
        // Process the hash fragment to extract access_token, etc.
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          toast({
            title: "Authentication Failed",
            description: error.message,
            variant: "destructive",
          });
        } else if (data.session) {
          console.log('Auth successful, session established');
          toast({
            title: "Authentication Successful",
            description: "You have been signed in successfully.",
          });
        } else {
          console.log('No session found, but no error either');
          // This could be a normal redirect without a session
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        toast({
          title: "Authentication Error",
          description: err instanceof Error ? err.message : 'An unexpected error occurred',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthRedirect();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg">Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md p-6 bg-card rounded-lg shadow-md">
          <h1 className="text-xl font-semibold text-destructive mb-2">Authentication Error</h1>
          <p className="text-card-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Please try signing in again. If the issue persists, contact support.
          </p>
          <div className="mt-6">
            <a 
              href="/auth" 
              className="text-primary hover:text-primary/80 underline"
            >
              Return to sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to the home page on success
  return <Navigate to="/" replace />;
};

export default AuthCallback;
