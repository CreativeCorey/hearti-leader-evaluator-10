import { supabase, getAuthRedirectUrl } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Get or create an anonymous user ID from localStorage
export const getOrCreateAnonymousId = (): string => {
  const key = "hearti-anonymous-user-id";
  let anonymousId = localStorage.getItem(key);
  
  if (!anonymousId) {
    anonymousId = uuidv4();
    localStorage.setItem(key, anonymousId);
  }
  
  return anonymousId;
};

// Create a mock anonymous user (for testing without auth)
export const createMockAnonymousUser = () => {
  const anonymousId = getOrCreateAnonymousId();
  return {
    id: anonymousId,
    email: `anonymous-${anonymousId.slice(0, 8)}@hearti-app.local`,
    user_metadata: {
      name: "Anonymous User",
      anonymous: true
    },
    app_metadata: {
      provider: "anonymous"
    }
  };
};

// Helper function to handle marketing consent
export const handleMarketingConsent = async (userId: string, email: string, name?: string) => {
  if (localStorage.getItem("marketing_consent") !== "true") {
    return;
  }

  try {
    // Call the marketing-subscribe edge function
    const { data, error } = await supabase.functions.invoke('marketing-subscribe', {
      body: {
        user_id: userId,
        email,
        name,
        marketing_consent: true
      }
    });

    if (error) {
      console.error("Error subscribing to marketing:", error);
    } else {
      console.log("Marketing subscription successful:", data);
    }
  } catch (error) {
    console.error("Failed to handle marketing consent:", error);
  }
};

// Helper for sign-up
export const signUpWithEmail = async (email: string, password: string, name?: string, organization?: string) => {
  const redirectUrl = getAuthRedirectUrl();
  console.log("Signup redirect URL:", redirectUrl);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || null,
        organization: organization || null,
        marketing_consent: localStorage.getItem("marketing_consent") === "true"
      },
      emailRedirectTo: redirectUrl
    }
  });
  
  return { data, error };
};

// Helper for sign-in
export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

// Helper for sign-out
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Helper for magic link
export const sendMagicLink = async (email: string) => {
  const redirectUrl = getAuthRedirectUrl();
  console.log("Magic link redirect URL:", redirectUrl);
  
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      shouldCreateUser: true
    }
  });
};

// Helper for password reset
export const sendPasswordReset = async (email: string) => {
  const redirectUrl = getAuthRedirectUrl();
  console.log("Password reset redirect URL:", redirectUrl);
  
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectUrl}?reset=true`,
  });
};

// Helper for updating profile
export const updateUserProfile = async (userId: string, updates: Record<string, any>) => {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
};

// Helper for fetching the current session
export const getCurrentSession = async () => {
  return await supabase.auth.getSession();
};

// Helper to bypass authentication for testing
export const allowAnonymousAccess = (enabled = true) => {
  if (enabled) {
    localStorage.setItem("hearti-anonymous-access", "enabled");
  } else {
    localStorage.removeItem("hearti-anonymous-access");
  }
  return enabled;
};

// Check if anonymous access is enabled
export const isAnonymousAccessEnabled = () => {
  return localStorage.getItem("hearti-anonymous-access") === "enabled";
};
