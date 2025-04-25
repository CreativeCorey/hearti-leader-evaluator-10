
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
  const redirectTimeoutRef = useRef<number | null>(null);
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
    
    // Clear any existing timeouts
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    
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
      
      // Store the URL in localStorage for manual recovery if needed
      localStorage.setItem('stripe_payment_url', data.url);
      
      toast({
        title: "Redirecting to payment",
        description: "You'll be redirected to complete your payment to unlock full results.",
      });
      
      // SIMPLIFIED REDIRECT APPROACH:
      // 1. Try with window.open first (most compatible with popup blockers)
      try {
        const newWindow = window.open(data.url, '_self');
        
        if (!newWindow) {
          console.log("Window.open failed, falling back to location.href");
          // 2. Fall back to direct location change
          window.location.href = data.url;
        }
      } catch (redirectError) {
        console.error("Primary redirect methods failed:", redirectError);
        // 3. Last resort - create a clickable element
        window.location.href = data.url;
        
        // Set a timeout to check if we're still here after the redirect attempt
        redirectTimeoutRef.current = window.setTimeout(() => {
          console.log("Checking if redirect worked...");
          if (document.hasFocus()) {
            toast({
              title: "Redirect Failed",
              description: "Please use the manual redirect button below.",
              variant: "destructive"
            });
          }
          setProcessingPayment(false);
        }, 3000);
      }
      
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
    redirectToStripePayment
  };
};
