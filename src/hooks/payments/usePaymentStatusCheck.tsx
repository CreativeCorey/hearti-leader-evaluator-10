
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { checkPaymentStatusFromAPI, validatePaymentData } from '@/utils/payment/paymentStatus';
import { handlePaymentError, handlePaymentStatusError } from '@/utils/payment/paymentErrors';

export const usePaymentStatusCheck = () => {
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkPaymentStatus = useCallback(async () => {
    if (!user) {
      console.log("No user found, skipping payment status check");
      setCheckingPayment(false);
      return;
    }
    
    try {
      setCheckingPayment(true);
      setPaymentError(null);
      
      console.log("Checking payment status for user:", user.id);
      const { data, error } = await checkPaymentStatusFromAPI(Date.now());
      
      if (error) {
        console.log("Payment status check error (non-critical):", error);
        // For authentication errors, just assume user hasn't paid
        setHasPaid(false);
        setPaymentError(null); // Don't show error for auth issues
        return;
      }
      
      const validationError = validatePaymentData(data);
      if (validationError) {
        console.log("Payment validation warning:", validationError);
        setPaymentError(null); // Don't show validation errors as user errors
      }
      
      setHasPaid(data.hasPaid);
      console.log("Payment status:", data.hasPaid ? "Paid" : "Not paid", data);
      
    } catch (error) {
      console.log("Payment check failed (treating as unpaid):", error);
      // Don't show errors for payment checks - just assume unpaid
      setHasPaid(false);
      setPaymentError(null);
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

