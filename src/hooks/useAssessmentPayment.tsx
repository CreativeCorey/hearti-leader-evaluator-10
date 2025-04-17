
import { useEffect } from 'react';
import { HEARTIAssessment } from '@/types';
import { usePaymentStatusCheck } from './payments/usePaymentStatusCheck';
import { useStripeRedirect } from './payments/useStripeRedirect';
import { usePaymentVerification } from './payments/usePaymentVerification';
import { useAuth } from '@/hooks/use-auth';

export const useAssessmentPayment = (onComplete: (assessment: HEARTIAssessment) => void) => {
  const { user } = useAuth();
  const { checkingPayment, hasPaid, paymentError, checkPaymentStatus } = usePaymentStatusCheck();
  const { processingPayment, redirectToStripePayment } = useStripeRedirect();
  const { verifyPayment } = usePaymentVerification(onComplete);
  
  // Check payment status when user changes
  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    }
  }, [user, checkPaymentStatus]);
  
  return {
    processingPayment,
    checkingPayment,
    hasPaid,
    paymentError,
    redirectToStripePayment,
    verifyPayment,
    refreshPaymentStatus: checkPaymentStatus
  };
};
