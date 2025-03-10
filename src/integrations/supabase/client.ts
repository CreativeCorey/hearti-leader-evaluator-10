
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://odwkgxdkjyccnkydxvjw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8";

// Get base URL dynamically to handle both development and production environments
const getBaseUrl = () => {
  // Check if window is defined (browser environment) 
  if (typeof window !== 'undefined') {
    // For production deployments, use the current window location
    return window.location.origin;
  }
  // Fallback to a default URL for server-side rendering or edge functions
  return 'https://hearti-app.com';
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure flow for handling redirect URLs
    // Use the dynamic base URL for redirects
    redirectTo: `${getBaseUrl()}/auth`
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Create an admin client for serverless functions (not used in browser)
export const createAdminClient = (serviceRoleKey: string) => {
  return createClient<Database>(SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
