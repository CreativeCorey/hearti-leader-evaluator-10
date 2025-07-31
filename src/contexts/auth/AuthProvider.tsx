
import React, { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthContext from './AuthContext';
import { getOrCreateAnonymousId, allowAnonymousAccess, isAnonymousAccessEnabled } from '@/utils/auth-helpers';
import { createMockAnonymousUser } from '@/utils/auth-helpers';
import { 
  signUpWithEmail,
  signInWithEmail,
  signOut as signOutUser,
  sendMagicLink,
  sendPasswordReset
} from '@/utils/auth-helpers';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anonymousId] = useState<string>(getOrCreateAnonymousId());
  const [anonymousMode, setAnonymousMode] = useState<boolean>(isAnonymousAccessEnabled());

  // Initialize auth state - SECURE VERSION: No anonymous access
  useEffect(() => {
    setIsLoading(true);
    
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setError(error.message);
          setUser(null);
          setSession(null);
        } else {
          // Validate session integrity
          if (data.session && data.session.access_token && data.session.user) {
            // Additional validation: Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            if (data.session.expires_at && data.session.expires_at > currentTime) {
              setSession(data.session);
              setUser(data.session.user);
            } else {
              // Session expired, clear it
              console.log('Session expired, clearing auth state');
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
            }
          } else {
            setSession(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to check auth:', err);
        setError('Failed to check authentication status');
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Listen for auth changes with proper validation
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        
        // Validate session before setting state
        if (session && session.access_token && session.user) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (session.expires_at && session.expires_at > currentTime) {
            setSession(session);
            setUser(session.user);
          } else {
            setSession(null);
            setUser(null);
          }
        } else {
          setSession(null);
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    // SECURITY: Disable anonymous mode permanently
    setAnonymousMode(false);
    
    // Initial check
    checkAuth();
    
    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // Remove anonymousMode dependency

  // Sign up function
  const signUp = async (email: string, password: string, name?: string, organization?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signUpWithEmail(email, password, name, organization);
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign up successful",
          description: "Please check your email for verification link",
        });
      }
      
      // We're explicitly ignoring the return value to match the Promise<void> type
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Sign up error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "Welcome back!",
          description: `You are now signed in as ${data.user.email}`,
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Sign in error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await signOutUser();
      
      if (error) {
        setError(error.message);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Clear all auth state
        setSession(null);
        setUser(null);
        setAnonymousMode(false);
        
        toast({
          title: "Signed out",
          description: "You have been successfully signed out",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Sign out error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send magic link function
  const sendMagicLinkEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await sendMagicLink(email);
      
      if (error) {
        setError(error.message);
        toast({
          title: "Magic link failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Magic link sent",
          description: "Please check your email for your sign-in link",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Magic link error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send password reset function
  const sendPasswordResetEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await sendPasswordReset(email);
      
      if (error) {
        setError(error.message);
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Please check your email for password reset instructions",
        });
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Password reset error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // SECURITY: Disable anonymous mode toggle for security
  const toggleAnonymousMode = () => {
    toast({
      title: "Anonymous Mode Disabled",
      description: "For security reasons, anonymous access has been disabled. Please sign in to continue.",
      variant: "destructive"
    });
  };

  // Provide context value
  const value = {
    user,
    anonymousId,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    sendMagicLink: sendMagicLinkEmail,
    sendPasswordResetEmail,
    error,
    anonymousMode,
    toggleAnonymousMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
