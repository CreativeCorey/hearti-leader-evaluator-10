
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ensureUserProfileExists } from "@/utils/supabaseHelpers";

// Get or create an anonymous user ID from localStorage
const getOrCreateAnonymousId = (): string => {
  const key = "hearti-anonymous-user-id";
  let anonymousId = localStorage.getItem(key);
  
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem(key, anonymousId);
    // Create profile for this anonymous user
    ensureUserProfileExists(anonymousId).catch(err => {
      console.error("Failed to create anonymous profile:", err);
    });
  }
  
  return anonymousId;
};

const AuthGuard = () => {
  const { user, isLoading } = useAuth();
  
  // Set up anonymous user ID if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      getOrCreateAnonymousId();
    }
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
