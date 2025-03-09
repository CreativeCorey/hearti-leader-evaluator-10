
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthCard from "@/components/auth/AuthCard";

const Auth = () => {
  const { user } = useAuth();

  // Redirect to home if user is already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center pt-4 md:pt-12">
        <AuthCard />
      </div>
    </Layout>
  );
};

export default Auth;
