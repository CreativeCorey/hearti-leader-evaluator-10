import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateAnonymousId, getUserProfile } from "../utils/localStorage";

const AuthGuard = () => {
  const { user, isLoading, session } = useAuth();

  console.log('AuthGuard render:', { user: !!user, isLoading, sessionExists: !!session });

  if (isLoading) {
    console.log('AuthGuard: showing loading...');
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // SECURITY: Only allow access for properly authenticated users with valid sessions
  if (user && session && session.access_token) {
    // Additional validation: Check if session is not expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (session.expires_at && session.expires_at > currentTime) {
      console.log('AuthGuard: user authenticated, showing protected content');
      return <Outlet />;
    }
  }

  console.log('AuthGuard: user not authenticated, redirecting to /auth');
  // Otherwise redirect to auth page
  return <Navigate to="/auth" replace />;
};

export default AuthGuard;
