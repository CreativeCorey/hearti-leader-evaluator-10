
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://odwkgxdkjyccnkydxvjw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kd2tneGRranljY25reWR4dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODE5MDUsImV4cCI6MjA1NjI1NzkwNX0.J8GU8omDDQ5OzXJM-DiF-A-hDU0vc7fL1dvoVtaWJE8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
