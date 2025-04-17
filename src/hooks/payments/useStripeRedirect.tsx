
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

export const useStripeRedirect = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const redirectToStripePayment = async (assessment: HEARTIAssessment) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with the payment.",
        variant: "destructive"
      });
      return false;
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
          origin: window.location.origin
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

      console.log("Redirecting to Stripe payment URL:", data.url);
      toast({
        title: "Redirecting to payment",
        description: "You'll be redirected to complete your payment to unlock full results.",
      });
      
      // Use a timeout to ensure the toast is shown before redirecting
      setTimeout(() => {
        try {
          console.log("Executing redirect to:", data.url);
          // Force redirect using direct assignment to avoid any interference
          window.location.href = data.url;
          
          // If we're still here after 5 seconds, something went wrong
          setTimeout(() => {
            if (document.hasFocus()) {
              console.error("Redirect may have failed, still on the same page after 5 seconds");
              setRedirectError("Redirect timeout - please try again");
              setProcessingPayment(false);
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
