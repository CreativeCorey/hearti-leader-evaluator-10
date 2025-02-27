
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const AuthGuard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default AuthGuard;
