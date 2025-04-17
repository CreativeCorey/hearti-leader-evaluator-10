
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

export const useStripeRedirect = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const redirectToStripePayment = async (assessment: HEARTIAssessment) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with the payment.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // Store the assessment temporarily in localStorage
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      
      console.log("Invoking create-payment function");
      const { data, error } = await supabase.functions.invoke('create-payment');
      
      if (error) {
        console.error("Create payment error:", error);
        throw error;
      }
      
      if (data.error) {
        console.error("Create payment API error:", data.error);
        throw new Error(data.error);
      }
      
      if (data.paid) {
        toast({
          title: "Payment Already Completed",
          description: "You've already paid for access to assessment results.",
        });
        return true;
      }
      
      if (data.url) {
        console.log("Redirecting to Stripe payment URL:", data.url);
        toast({
          title: "Redirecting to payment",
          description: "You'll be redirected to complete your payment to unlock full results.",
        });
        
        setTimeout(() => {
          window.location.href = data.url;
        }, 1500);
        return false;
      } else {
        throw new Error("No payment URL returned from server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to start payment process. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  return {
    processingPayment,
    redirectToStripePayment
  };
};
