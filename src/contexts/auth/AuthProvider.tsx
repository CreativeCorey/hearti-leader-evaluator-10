
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateAnonymousId, handleMarketingConsent, signUpWithEmail, 
  signInWithEmail, signOut as authSignOut, sendMagicLink as authSendMagicLink,
  sendPasswordReset, updateUserProfile } from "@/utils/auth-helpers";
import AuthContext, { AuthContextType } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [anonymousId, setAnonymousId] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Always get or create an anonymous ID
        const anonId = getOrCreateAnonymousId();
        setAnonymousId(anonId);
      } catch (error) {
        console.error("Error getting session:", error);
        setError("Failed to get session");
        
        // Still set an anonymous ID in case of error
        const anonId = getOrCreateAnonymousId();
        setAnonymousId(anonId);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name?: string, organization?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await signUpWithEmail(email, password, name, organization);

      if (error) {
        setError(error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      // If successful registration
      if (data.user) {
        if (data.user.identities?.length === 0) {
          toast({
            title: "Account already exists",
            description: "Please sign in instead",
            variant: "destructive"
          });
          return;
        }

        // If user has consented to marketing emails, trigger our marketing integrations
        if (localStorage.getItem("marketing_consent") === "true" && data.user.id) {
          await handleMarketingConsent(data.user.id, data.user.email || email, name);
        }

        toast({
          title: "Sign up successful",
          description: "Please check your email for the verification link before signing in.",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await signInWithEmail(email, password);

      if (error) {
        let errorMessage = error.message;
        
        // Check if user exists but hasn't confirmed their email
        const { data: userData } = await signUpWithEmail(email, password);

        if (userData?.user?.identities?.length === 0) {
          errorMessage = "Please check your email and verify your account before signing in.";
        }

        setError(errorMessage);
        toast({
          title: "Sign in failed",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (data.session && data.user) {
        // If user has consented to marketing, update the profile
        if (localStorage.getItem("marketing_consent") === "true") {
          await updateUserProfile(data.user.id, {
            marketing_consent: true
          });
          
          // Also trigger marketing integrations
          await handleMarketingConsent(data.user.id, data.user.email || email);
        }

        toast({
          title: "Sign in successful",
          description: "You have been successfully signed in."
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authSignOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMagicLink = async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await authSendMagicLink(email);

      if (error) {
        setError(error.message);
        toast({
          title: "Failed to send magic link",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Magic link sent",
        description: "Please check your email for the login link",
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Failed to send magic link",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await sendPasswordReset(email);

      if (error) {
        setError(error.message);
        toast({
          title: "Failed to send reset email",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link",
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast({
          title: "Failed to send reset email",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value with all the auth functions and state
  const contextValue: AuthContextType = {
    user,
    anonymousId,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    sendMagicLink,
    sendPasswordResetEmail,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
