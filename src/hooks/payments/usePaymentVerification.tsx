
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

export const usePaymentVerification = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const [paymentVerificationError, setPaymentVerificationError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();
  
  const verifyPayment = async (sessionId: string) => {
    if (verifying) {
      console.log("Verification already in progress, skipping duplicate request");
      return false;
    }
    
    try {
      setVerifying(true);
      setPaymentVerificationError(null);
      console.log("Verifying payment for session:", sessionId);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId, timestamp: Date.now() } // Add timestamp to prevent caching
      });
      
      if (error) {
        console.error("Payment verification API error:", error);
        setPaymentVerificationError(error.message);
        throw error;
      }
      
      if (data.error) {
        console.error("Payment verification error response:", data.error);
        setPaymentVerificationError(data.error);
        throw new Error(data.error);
      }
      
      console.log("Payment verification result:", data);
      
      if (data.paid) {
        const pendingAssessment = localStorage.getItem('pending_assessment');
        if (pendingAssessment) {
          try {
            const assessment = JSON.parse(pendingAssessment);
            onComplete(assessment);
            localStorage.removeItem('pending_assessment');
            
            toast({
              title: "Payment Successful!",
              description: "Your results are now unlocked. Thank you for your purchase.",
            });
          } catch (parseError) {
            console.error("Failed to parse stored assessment:", parseError);
            setPaymentVerificationError("Failed to load assessment data");
            toast({
              title: "Data Error",
              description: "Your payment was successful, but we couldn't load your results. Please refresh the page.",
              variant: "destructive"
            });
          }
        } else {
          console.log("No pending assessment found after verification");
        }
        return true;
      }
      
      console.log("Payment not confirmed:", data);
      return false;
    } catch (error) {
      console.error("Payment verification error:", error);
      setPaymentVerificationError(error instanceof Error ? error.message : "Failed to verify payment");
      toast({
        title: "Verification Error",
        description: "Failed to verify your payment. Please contact support.",
        variant: "destructive"
      });
      return false;
    } finally {
      setVerifying(false);
    }
  };

  return {
    verifying,
    paymentVerificationError,
    verifyPayment
  };
};
