
import { supabase } from '@/integrations/supabase/client';

export const checkPaymentStatusFromAPI = async (timestamp: number) => {
  const { data, error } = await supabase.functions.invoke('check-payment-status', {
    body: { timestamp } // Add timestamp to prevent caching issues
  });
  
  if (error) throw error;
  return { data, error: data.error };
};

export const validatePaymentData = (data: any) => {
  if (data.tableExists === false) {
    console.log("Payments table does not exist yet");
    return "Payment system is being set up. Please try again later.";
  }
  return null;
};

