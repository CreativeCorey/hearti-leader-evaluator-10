
import { useState, useRef } from 'react';
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
  
  const redirectToStripePayment = async (assessment: HEARTIAssessment) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with the payment.",
        variant: "destructive"
      });
      return false;
    }
    
    // Clear any existing timeout
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    
    setProcessingPayment(true);
    setRedirectError(null);
    
    try {
      // Store the assessment temporarily in localStorage
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
          }
        }
      });
      
      if (error) {
        console.error("Create payment error:", error);
        setRedirectError(error.message || "Payment creation failed");
        throw error;
      }
      
      if (data.error) {
        console.error("Create payment API error:", data.error);
        setRedirectError(data.error);
        throw new Error(data.error);
      }
      
      if (data.paid) {
        toast({
          title: "Payment Already Completed",
          description: "You've already paid for access to assessment results.",
        });
        return true;
      }
      
      if (!data.url) {
        throw new Error("No payment URL returned from server");
      }

      console.log("Received Stripe payment URL:", data.url);
      toast({
        title: "Redirecting to payment",
        description: "You'll be redirected to complete your payment to unlock full results.",
      });
      
      // Use a timeout to ensure the toast is shown before redirecting
      redirectTimeoutRef.current = window.setTimeout(() => {
        try {
          console.log("Executing redirect to:", data.url);
          
          // Create a backup plan in case direct location change fails
          const backupTimeout = window.setTimeout(() => {
            console.log("Trying backup redirect method");
            const link = document.createElement('a');
            link.href = data.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.click();
          }, 1000);
          
          // Primary redirect method
          window.location.href = data.url;
          
          // Set a longer timeout to check if we're still on the same page
          window.setTimeout(() => {
            if (document.hasFocus()) {
              console.error("Redirect may have failed, still on the same page after 5 seconds");
              setRedirectError("Redirect timeout - please try again or check popup blockers");
              setProcessingPayment(false);
              // Clear the backup timeout if we detected an issue
              window.clearTimeout(backupTimeout);
            }
          }, 5000);
          
        } catch (redirectErr) {
          console.error("Redirect execution error:", redirectErr);
          setRedirectError("Failed to redirect to payment page");
          setProcessingPayment(false);
        }
      }, 1000);
      
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
  };

  return {
    processingPayment,
    redirectError,
    redirectToStripePayment
  };
};
