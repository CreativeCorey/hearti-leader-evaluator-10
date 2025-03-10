
import { USE_SUPABASE_KEY } from './constants';

// Supabase Usage Flag
export const getUseSupabase = (): boolean => {
  const useSupabase = localStorage.getItem(USE_SUPABASE_KEY);
  return useSupabase === 'true';
};

export const setUseSupabase = (useSupabase: boolean): void => {
  localStorage.setItem(USE_SUPABASE_KEY, useSupabase.toString());
};
