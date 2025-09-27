
import { useAuth } from "@/hooks/use-auth";
import { Navigate, useSearchParams } from "react-router-dom";
import AuthCard from "@/components/auth/AuthCard";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";

const Auth = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [searchParams] = useSearchParams();

  // Set document title based on language
  useEffect(() => {
    document.title = `HEARTI™ - ${currentLanguage === 'en' ? 'Authentication' : 
      currentLanguage === 'zh' ? '认证' : 
      currentLanguage === 'it' ? 'Autenticazione' : 
      currentLanguage === 'fr' ? 'Authentification' : 
      currentLanguage === 'es' ? 'Autenticación' : 
      currentLanguage === 'de' ? 'Authentifizierung' : 
      currentLanguage === 'ar' ? 'المصادقة' : 
      currentLanguage === 'ja' ? '認証' : 'Authentication'}`;
  }, [currentLanguage]);

  // Check if this is a password reset redirect
  const isPasswordReset = searchParams.get('reset') === 'true';
  
  // If this is a password reset flow, redirect to password reset page
  if (isPasswordReset) {
    return <Navigate to="/password-reset" replace />;
  }

  // Redirect to home if user is already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center pt-4 md:pt-12">
      <AuthCard />
    </div>
  );
};

export default Auth;
