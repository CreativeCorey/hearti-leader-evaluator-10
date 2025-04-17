
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { HEARTIAssessment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAssessmentPayment = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if the user has already paid
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) {
        setCheckingPayment(false);
        return;
      }
      
      try {
        setCheckingPayment(true);
        const { data, error } = await supabase.functions.invoke('check-payment-status');
        
        if (error) {
          console.error("Payment status check failed:", error);
          toast({
            title: "Error",
            description: "Failed to check payment status. Please try again.",
            variant: "destructive"
          });
        } else {
          setHasPaid(data.hasPaid);
          console.log("Payment status:", data.hasPaid ? "Paid" : "Not paid");
        }
      } catch (error) {
        console.error("Payment status check error:", error);
      } finally {
        setCheckingPayment(false);
      }
    };
    
    checkPaymentStatus();
  }, [user, toast]);
  
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
      
      // Create a payment session using the Stripe edge function
      const { data, error } = await supabase.functions.invoke('create-payment');
      
      if (error) {
        throw error;
      }
      
      if (data.paid) {
        // User has already paid, no need to redirect to Stripe
        setHasPaid(true);
        onComplete(assessment);
        toast({
          title: "Payment Already Completed",
          description: "You've already paid for access to assessment results.",
        });
        return;
      }
      
      // Redirect to Stripe checkout
      if (data.url) {
        toast({
          title: "Redirecting to payment",
          description: "You'll be redirected to complete your payment to unlock full results.",
        });
        
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL returned from server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "Failed to start payment process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const verifyPayment = async (sessionId: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.paid) {
        setHasPaid(true);
        
        // Get the pending assessment from localStorage
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
      toast({
        title: "Verification Error",
        description: "Failed to verify your payment. Please contact support.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  return {
    processingPayment,
    checkingPayment,
    hasPaid,
    redirectToStripePayment,
    verifyPayment
  };
};
