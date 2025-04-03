
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import AuthCard from "@/components/auth/AuthCard";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/language/LanguageContext";

const Auth = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();

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
