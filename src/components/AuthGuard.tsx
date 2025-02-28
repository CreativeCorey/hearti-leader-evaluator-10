
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ensureUserProfileExists } from "@/utils/supabaseHelpers";
import { useToast } from "@/hooks/use-toast";

// Get or create an anonymous user ID from localStorage
const getOrCreateAnonymousId = (): string => {
  const key = "hearti-anonymous-user-id";
  let anonymousId = localStorage.getItem(key);
  
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem(key, anonymousId);
  }
  
  return anonymousId;
};

const AuthGuard = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Set up anonymous user ID if not authenticated
  useEffect(() => {
    const initializeAnonymousUser = async () => {
      if (!isLoading && !user) {
        const anonymousId = getOrCreateAnonymousId();
        console.log("Using anonymous ID:", anonymousId);
        
        try {
          // Try to ensure the user profile exists
          const profileExists = await ensureUserProfileExists(anonymousId);
          console.log("Profile exists or was created:", profileExists);
          
          if (!profileExists) {
            console.warn("Failed to ensure anonymous profile exists, but continuing anyway");
            
            // We'll continue even if profile creation fails
            // This allows local storage fallback to work
          }
        } catch (error) {
          console.error("Error ensuring anonymous profile:", error);
          // Still continue even if there's an error
        }
      }
    };
    
    initializeAnonymousUser();
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return <Outlet />;
};

export default AuthGuard;
