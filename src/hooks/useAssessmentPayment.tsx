
import { useEffect, useState } from 'react';
import { HEARTIAssessment } from '@/types';
import { usePaymentStatusCheck } from './payments/usePaymentStatusCheck';
import { useStripeRedirect } from './payments/useStripeRedirect';
import { usePaymentVerification } from './payments/usePaymentVerification';
import { useAuth } from '@/hooks/use-auth';

export const useAssessmentPayment = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const { user } = useAuth();
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const { checkingPayment, hasPaid, paymentError, checkPaymentStatus, userRole, viewMode, setViewMode } = usePaymentStatusCheck();
  const { processingPayment, redirectError, redirectToStripePayment } = useStripeRedirect();
  const { paymentVerificationError, verifyPayment } = usePaymentVerification(onComplete);
  
  // Check payment status when user changes or after a certain interval
  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    }
  }, [user, checkPaymentStatus, lastRefreshTime]);
  
  // Set up interval for periodic refresh (every 60 seconds)
  useEffect(() => {
    if (!user || hasPaid) return;
    
    const intervalId = setInterval(() => {
      console.log("Triggering periodic payment status refresh");
      setLastRefreshTime(Date.now());
    }, 60000); // Refresh every 60 seconds
    
    return () => clearInterval(intervalId);
  }, [user, hasPaid]);
  
  // Force refresh right after redirection attempt
  useEffect(() => {
    if (processingPayment) {
      const timeoutId = setTimeout(() => {
        console.log("Payment might be processing, refreshing status");
        setLastRefreshTime(Date.now());
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [processingPayment]);
  
  return {
    processingPayment,
    checkingPayment,
    hasPaid,
    paymentError: paymentError || redirectError || paymentVerificationError,
    redirectToStripePayment,
    verifyPayment,
    refreshPaymentStatus: () => {
      console.log("Manual payment status refresh requested");
      setLastRefreshTime(Date.now());
    },
    userRole,
    viewMode,
    setViewMode
  };
};
