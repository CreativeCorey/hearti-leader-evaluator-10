
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
  const backupTimeoutRef = useRef<number | null>(null);
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
    
    if (backupTimeoutRef.current) {
      window.clearTimeout(backupTimeoutRef.current);
      backupTimeoutRef.current = null;
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
      toast({
        title: "Redirecting to payment",
        description: "You'll be redirected to complete your payment to unlock full results.",
      });
      
      // Direct navigation approach - most reliable method
      try {
        // Short delay to allow toast to display
        redirectTimeoutRef.current = window.setTimeout(() => {
          // Force navigation to Stripe - most reliable approach
          window.location.href = data.url;
          
          // Add a backup for cases where direct navigation might be blocked
          backupTimeoutRef.current = window.setTimeout(() => {
            if (document.hasFocus()) {
              console.log("Using backup redirect method");
              window.open(data.url, '_self');
              
              // Final backup - if still on page, reset state
              window.setTimeout(() => {
                if (document.hasFocus()) {
                  setProcessingPayment(false);
                  toast({
                    title: "Redirection Issue",
                    description: "Please try again or click the payment button manually.",
                    variant: "destructive"
                  });
                }
              }, 5000);
            }
          }, 2000);
        }, 300);
      } catch (redirectErr) {
        console.error("Redirect execution error:", redirectErr);
        setRedirectError("Failed to redirect to payment page");
        setProcessingPayment(false);
        toast({
          title: "Redirection Error",
          description: "Unable to open Stripe payment page. Please try again.",
          variant: "destructive"
        });
      }
      
      return false;
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
