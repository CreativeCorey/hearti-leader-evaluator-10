import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

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

type AuthContextType = {
  user: User | null;
  anonymousId: string;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name?: string, organization?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || null,
            organization: organization || null
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

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

        // Try to manually create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name: name || null,
            organization: organization || null
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast({
            title: "Profile creation failed",
            description: "Your account was created but we couldn't set up your profile. This won't affect your ability to use the app.",
            variant: "destructive"
          });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        let errorMessage = error.message;
        
        // Check if user exists but hasn't confirmed their email
        const { data: userData } = await supabase.auth.signUp({
          email,
          password
        });

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

      if (data.session) {
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
      await supabase.auth.signOut();
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
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

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
      
      // Don't return data, just return void
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

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
      
      // Don't need to return anything
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

  return (
    <AuthContext.Provider value={{ 
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
