
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
        console.log('Query params:', Object.fromEntries(queryParams.entries()));
        console.log('Hash params:', Object.fromEntries(hashParams.entries()));
        console.log('Is recovery flow:', isRecovery);
        
        // Process the session
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
          
          // Force navigate to root to avoid any callback URL issues
          navigate('/', { replace: true });
        } else {
          console.log('No session found, but no error either');
          // This is unexpected - we should have either a session or an error
          setError('Authentication failed: No session established');
          toast({
            title: "Authentication Failed",
            description: "No session was established. Please try again.",
            variant: "destructive",
          });
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
  }, [toast, navigate]);

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

  // Redirect to the home page on success (this will likely not be reached due to the navigate() call above)
  return <Navigate to="/" replace />;
};

export default AuthCallback;
