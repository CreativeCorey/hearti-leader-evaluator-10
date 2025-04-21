
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
      
      // Store the URL in localStorage for manual recovery if needed
      localStorage.setItem('stripe_payment_url', data.url);
      
      // COMPLETELY REVAMPED REDIRECTION LOGIC
      // Directly attempt window.location.href first as the most reliable method
      window.location.href = data.url;
      
      // Set a fallback for browsers that might not navigate immediately
      redirectTimeoutRef.current = window.setTimeout(() => {
        // Check if we're still on the page after the redirect attempt
        console.log("Checking if redirect worked...");
        if (document.hasFocus()) {
          console.log("Still on page, trying backup redirect method");
          
          try {
            // Try opening in a new window/tab as a backup
            const newWindow = window.open(data.url, '_blank');
            
            // If window.open fails or is blocked, show manual copy option
            if (!newWindow) {
              toast({
                title: "Redirect Blocked",
                description: "Please click the payment button again or copy the payment URL manually.",
                variant: "destructive"
              });
              
              // Create a button that users can click to try again
              const paymentElement = document.createElement('div');
              paymentElement.innerHTML = `
                <div style="position:fixed;top:20px;right:20px;background:white;padding:15px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;">
                  <p style="margin:0 0 10px;font-weight:bold;">Payment Redirect Failed</p>
                  <p style="margin:0 0 10px;">Click the button below to try again:</p>
                  <button id="manual-redirect" style="background:#4f46e5;color:white;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;">Open Payment Page</button>
                </div>
              `;
              document.body.appendChild(paymentElement);
              
              document.getElementById('manual-redirect')?.addEventListener('click', () => {
                window.open(data.url, '_blank');
                paymentElement.remove();
              });
              
              // Auto-remove after 15 seconds
              setTimeout(() => paymentElement.remove(), 15000);
            }
          } catch (backupError) {
            console.error("Backup redirect also failed:", backupError);
          }
          
          // Reset state so user can try again
          setProcessingPayment(false);
        }
      }, 2500);
      
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
