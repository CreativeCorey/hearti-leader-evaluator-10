
import { USE_SUPABASE_KEY } from './constants';

// Supabase Usage Flag
export const getUseSupabase = (): boolean => {
  const useSupabase = localStorage.getItem(USE_SUPABASE_KEY);
  // Default to true if not set
  return useSupabase !== 'false';
};

export const setUseSupabase = (useSupabase: boolean): void => {
  localStorage.setItem(USE_SUPABASE_KEY, useSupabase.toString());
};
