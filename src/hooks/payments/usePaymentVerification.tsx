
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

export const usePaymentVerification = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const verifyPayment = async (sessionId: string) => {
    try {
      setPaymentError(null);
      console.log("Verifying payment for session:", sessionId);
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      if (data.paid) {
        const pendingAssessment = localStorage.getItem('pending_assessment');
        if (pendingAssessment) {
          const assessment = JSON.parse(pendingAssessment);
          onComplete(assessment);
          localStorage.removeItem('pending_assessment');
          
          toast({
            title: "Payment Successful!",
            description: "Your results are now unlocked. Thank you for your purchase.",
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentError(error instanceof Error ? error.message : "Failed to verify payment");
      toast({
        title: "Verification Error",
        description: "Failed to verify your payment. Please contact support.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    paymentError,
    verifyPayment
  };
};
