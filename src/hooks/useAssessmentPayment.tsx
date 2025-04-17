
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { HEARTIAssessment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAssessmentPayment = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if the user has already paid
  const checkPaymentStatus = useCallback(async () => {
    if (!user) {
      setCheckingPayment(false);
      return;
    }
    
    try {
      setCheckingPayment(true);
      setPaymentError(null);
      
      console.log("Checking payment status for user:", user.id);
      const { data, error } = await supabase.functions.invoke('check-payment-status');
      
      if (error) {
        console.error("Payment status check failed:", error);
        setPaymentError("Failed to check payment status");
        toast({
          title: "Error",
          description: "Failed to check payment status. Please try again.",
          variant: "destructive"
        });
        setHasPaid(false); // Default to not paid on error
      } else if (data.error) {
        console.error("Payment status error:", data.error);
        setPaymentError(data.error);
        toast({
          title: "Error",
          description: data.error || "Failed to check payment status",
          variant: "destructive"
        });
        setHasPaid(false); // Default to not paid on error
      } else {
        setHasPaid(data.hasPaid);
        console.log("Payment status:", data.hasPaid ? "Paid" : "Not paid", data);
        
        // Check if table exists
        if (data.tableExists === false) {
          console.log("Payments table does not exist yet");
          setPaymentError("Payment system is being set up. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      setPaymentError("Failed to connect to payment service");
      toast({
        title: "Error",
        description: "Failed to check payment status. Please try again.",
        variant: "destructive"
      });
      setHasPaid(false); // Default to not paid on error
    } finally {
      setCheckingPayment(false);
    }
  }, [user, toast]);
  
  // Check payment status when user changes
  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    } else {
      setCheckingPayment(false);
    }
  }, [user, checkPaymentStatus]);
  
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
    setPaymentError(null);
    
    try {
      // Store the assessment temporarily in localStorage
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      
      // Create a payment session using the Stripe edge function
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
        console.log("Redirecting to Stripe payment URL:", data.url);
        toast({
          title: "Redirecting to payment",
          description: "You'll be redirected to complete your payment to unlock full results.",
        });
        
        // Small delay before redirecting to ensure toast is visible
        setTimeout(() => {
          window.location.href = data.url;
        }, 1000);
      } else {
        throw new Error("No payment URL returned from server");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error instanceof Error ? error.message : "Failed to start payment process");
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to start payment process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const verifyPayment = async (sessionId: string) => {
    if (!user) return false;
    
    try {
      setPaymentError(null);
      console.log("Verifying payment for session:", sessionId);
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.error) {
        throw new Error(data.error);
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
      setPaymentError(error instanceof Error ? error.message : "Failed to verify payment");
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
    paymentError,
    redirectToStripePayment,
    verifyPayment,
    // Add a manual refresh function
    refreshPaymentStatus: checkPaymentStatus
  };
};
