
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

export const useStripeRedirect = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const lastAttemptRef = useRef<number | null>(null);
  
  const redirectToStripePayment = useCallback(async (assessment: HEARTIAssessment, paymentType: 'one-time' | 'subscription' = 'subscription') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with the payment.",
        variant: "destructive"
      });
      return false;
    }
    
    const now = Date.now();
    if (lastAttemptRef.current && now - lastAttemptRef.current < 3000) {
      console.log("Throttling repeated payment attempts");
      return false;
    }
    lastAttemptRef.current = now;
    
    setProcessingPayment(true);
    setRedirectError(null);
    
    try {
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      
      console.log("Invoking create-payment function with timestamp:", Date.now());
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          timestamp: Date.now(),
          userId: user.id,
          userEmail: user.email,
          origin: window.location.origin,
          assessment: {
            id: assessment.id,
            date: assessment.date,
            dimensionScores: assessment.dimensionScores
          },
          paymentType
        }
      });
      
      if (error) {
        console.error("Create payment error:", error);
        setRedirectError(error.message || "Payment creation failed");
        setProcessingPayment(false);
        throw error;
      }
      
      if (data.error) {
        console.error("Create payment API error:", data.error);
        setRedirectError(data.error);
        setProcessingPayment(false);
        throw new Error(data.error);
      }
      
      if (data.paid) {
        toast({
          title: "Payment Already Completed",
          description: "You've already paid for access to assessment results.",
        });
        setProcessingPayment(false);
        return true;
      }
      
      if (!data.url) {
        setProcessingPayment(false);
        throw new Error("No payment URL returned from server");
      }

      console.log("Received Stripe payment URL:", data.url);
      
      // Store the URL in localStorage for manual retrieval
      localStorage.setItem('stripe_payment_url', data.url);
      
      toast({
        title: "Payment Ready",
        description: "Please use the manual redirect button to continue to payment.",
      });
      
      // No longer perform automatic redirect
      setProcessingPayment(false);
      
      return true;
    } catch (error) {
      console.error("Payment error:", error);
      setRedirectError(error instanceof Error ? error.message : String(error));
      setProcessingPayment(false);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to start payment process. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, toast]);

  return {
    processingPayment,
    redirectError,
    redirectToStripePayment,
    lastAttemptTime: lastAttemptRef.current
  };
};
