import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateAnonymousId, getUserProfile } from "../utils/localStorage";

const AuthGuard = () => {
  const { user, isLoading, anonymousMode } = useAuth();
  const { toast } = useToast();
  
  // Set up anonymous user ID if not authenticated
  useEffect(() => {
    const initializeAnonymousUser = async () => {
      if (!isLoading && !user && !anonymousMode) {
        try {
          // Get or create anonymous ID and ensure user exists
          const anonymousId = getOrCreateAnonymousId();
          console.log("Using anonymous ID:", anonymousId);
          
          // Try to ensure the user profile exists in localStorage
          const userProfile = await getUserProfile();
          console.log("User profile created or retrieved:", userProfile);
        } catch (error) {
          console.error("Error initializing anonymous user:", error);
          toast({
            title: "Initialization Error",
            description: "There was a problem setting up your anonymous profile. Some features may be limited.",
            variant: "destructive",
          });
        }
      }
    };
    
    initializeAnonymousUser();
  }, [user, isLoading, anonymousMode, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // Allow access if user is logged in OR anonymous mode is enabled
  if (user || anonymousMode) {
    return <Outlet />;
  }

  // Otherwise redirect to auth page
  return <Navigate to="/auth" replace />;
};

export default AuthGuard;
