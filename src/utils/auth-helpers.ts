import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { User } from "@supabase/supabase-js";

// Helper function to get the redirect URL for authentication
export const getAuthRedirectUrl = (): string => {
  return window.location.origin + '/auth';
};

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
export const createMockAnonymousUser = (): Partial<User> => {
  const anonymousId = getOrCreateAnonymousId();
  const now = new Date().toISOString();
  
  return {
    id: anonymousId,
    email: `anonymous-${anonymousId.slice(0, 8)}@hearti-app.local`,
    user_metadata: {
      name: "Anonymous User",
      anonymous: true
    },
    app_metadata: {
      provider: "anonymous"
    },
    aud: "authenticated",
    created_at: now
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

// Helper for sign-up with input validation
export const signUpWithEmail = async (email: string, password: string, name?: string, organization?: string) => {
  // Import validation functions
  const { validateEmail, validatePassword, sanitizeText, validateUserName, validateOrganizationName } = await import('./input-validation');
  
  // Validate inputs
  if (!validateEmail(email)) {
    return { data: null, error: { message: "Invalid email format" } };
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return { data: null, error: { message: passwordValidation.errors.join('. ') } };
  }
  
  // Sanitize optional inputs
  const sanitizedName = name ? sanitizeText(name, 50) : null;
  const sanitizedOrg = organization ? sanitizeText(organization, 100) : null;
  
  // Additional validation for name and organization
  if (sanitizedName && !validateUserName(sanitizedName)) {
    return { data: null, error: { message: "Invalid name format" } };
  }
  
  if (sanitizedOrg && !validateOrganizationName(sanitizedOrg)) {
    return { data: null, error: { message: "Invalid organization name format" } };
  }
  
  const redirectUrl = getAuthRedirectUrl();
  console.log("Signup redirect URL:", redirectUrl);
  
  const { data, error } = await supabase.auth.signUp({
    email: email.toLowerCase().trim(),
    password,
    options: {
      data: {
        name: sanitizedName,
        organization: sanitizedOrg,
        marketing_consent: localStorage.getItem("marketing_consent") === "true"
      },
      emailRedirectTo: redirectUrl
    }
  });
  
  return { data, error };
};

// Helper for sign-in with input validation
export const signInWithEmail = async (email: string, password: string) => {
  // Import validation functions
  const { validateEmail } = await import('./input-validation');
  
  // Validate email format
  if (!validateEmail(email)) {
    return { data: null, error: { message: "Invalid email format" } };
  }
  
  // Basic password length check for sign-in
  if (!password || password.length < 1 || password.length > 128) {
    return { data: null, error: { message: "Invalid password" } };
  }
  
  return await supabase.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
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
  const redirectUrl = `${window.location.origin}/password-reset`;
  console.log("Password reset redirect URL:", redirectUrl);
  
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
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

// SECURITY: Anonymous access disabled for security reasons
export const allowAnonymousAccess = (enabled = false) => {
  // Always return false - anonymous access is permanently disabled
  localStorage.removeItem("hearti-anonymous-access");
  console.warn("Anonymous access has been disabled for security reasons");
  return false;
};

// Check if anonymous access is enabled - always returns false for security
export const isAnonymousAccessEnabled = () => {
  return false; // Permanently disabled for security
};
