
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentStatusCheck = () => {
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkPaymentStatus = useCallback(async () => {
    if (!user) {
      setCheckingPayment(false);
      return;
    }
    
    try {
      setCheckingPayment(true);
      setPaymentError(null);
      
      console.log("Checking payment status for user:", user.id);
      const { data, error } = await supabase.functions.invoke('check-payment-status');
      
      if (error) {
        console.error("Payment status check failed:", error);
        setPaymentError("Failed to check payment status");
        toast({
          title: "Error",
          description: "Failed to check payment status. Please try again.",
          variant: "destructive"
        });
        setHasPaid(false);
      } else if (data.error) {
        console.error("Payment status error:", data.error);
        setPaymentError(data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to check payment status",
          variant: "destructive"
        });
        setHasPaid(false);
      } else {
        setHasPaid(data.hasPaid);
        console.log("Payment status:", data.hasPaid ? "Paid" : "Not paid", data);
        
        if (data.tableExists === false) {
          console.log("Payments table does not exist yet");
          setPaymentError("Payment system is being set up. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      setPaymentError("Failed to connect to payment service");
      toast({
        title: "Error",
        description: "Failed to check payment status. Please try again.",
        variant: "destructive"
      });
      setHasPaid(false);
    } finally {
      setCheckingPayment(false);
    }
  }, [user, toast]);

  return {
    checkingPayment,
    hasPaid,
    paymentError,
    checkPaymentStatus
  };
};
