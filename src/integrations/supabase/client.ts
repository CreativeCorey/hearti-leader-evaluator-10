
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://odwkgxdkjyccnkydxvjw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
    },
    fetch: (...args) => {
      // @ts-ignore - first argument is the input
      const [url, options = {}] = args;
      const headers = {
        ...options?.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
      };
      
      return fetch(url, {
        ...options,
        headers,
      });
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
