
import { useState, useRef, useCallback, useEffect } from 'react';
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
  const redirectFormRef = useRef<HTMLFormElement | null>(null);
  
  // Clean up any previous redirect form
  useEffect(() => {
    return () => {
      if (redirectFormRef.current && redirectFormRef.current.parentNode) {
        redirectFormRef.current.parentNode.removeChild(redirectFormRef.current);
        redirectFormRef.current = null;
      }
    };
  }, []);
  
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
      const response = await supabase.functions.invoke('create-payment', {
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
      
      const { data, error } = response;
      
      if (error) {
        console.error("Create payment error:", error);
        setRedirectError(error.message || "Payment creation failed");
        setProcessingPayment(false);
        
        toast({
          title: "Payment Error",
          description: "Failed to create payment session. Please try again or use the manual redirect.",
          variant: "destructive"
        });
        throw error;
      }
      
      if (!data || data.error) {
        console.error("Create payment API error:", data?.error || "No data returned");
        setRedirectError(data?.error || "Payment creation failed");
        setProcessingPayment(false);
        
        toast({
          title: "Payment Error",
          description: data?.error || "Failed to create payment session. Please try the manual redirect.",
          variant: "destructive"
        });
        throw new Error(data?.error || "No payment URL returned from server");
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
        toast({
          title: "Payment Error",
          description: "No payment URL was returned. Please try the manual redirect.",
          variant: "destructive"
        });
        throw new Error("No payment URL returned from server");
      }

      console.log("Received Stripe payment URL:", data.url);
      
      // Store the URL in localStorage for manual recovery if needed
      localStorage.setItem('stripe_payment_url', data.url);
      
      toast({
        title: "Redirecting to payment",
        description: "You'll be redirected to complete your payment to unlock full results.",
      });
      
      // COMPREHENSIVE MULTI-STRATEGY REDIRECT APPROACH:
      
      // Strategy 1: Direct location change (most reliable but may be blocked)
      window.location.href = data.url;
      
      // Strategy 2: Use a form submission as backup (happens after a short delay)
      setTimeout(() => {
        try {
          // Create a form element to submit
          const form = document.createElement('form');
          form.method = 'GET';
          form.action = data.url;
          form.style.display = 'none';
          document.body.appendChild(form);
          redirectFormRef.current = form;
          form.submit();
        } catch (redirectError) {
          console.error("Form redirect failed:", redirectError);
        }
      }, 500);
      
      // Set a timeout to check if we're still here after all redirect attempts
      redirectTimeoutRef.current = window.setTimeout(() => {
        console.log("Checking if redirect worked...");
        if (document.hasFocus()) {
          toast({
            title: "Automatic Redirect Failed",
            description: "Please use the manual redirect button below.",
            variant: "destructive"
          });
        }
        setProcessingPayment(false);
      }, 2000);
      
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
