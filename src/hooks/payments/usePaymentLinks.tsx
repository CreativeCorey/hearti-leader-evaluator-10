import { useState } from 'react';
import { STRIPE_PAYMENT_LINKS } from '@/utils/payment/paymentLinks';
import { HEARTIAssessment } from '@/types';

export const usePaymentLinks = () => {
  const [processingPayment, setProcessingPayment] = useState(false);

  const redirectToPayment = async (
    assessment: HEARTIAssessment, 
    paymentType: 'monthly' | 'annual'
  ) => {
    setProcessingPayment(true);
    
    try {
      // Store assessment data for after payment
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      localStorage.removeItem('payment_error');
      
      // Get the payment link
      const paymentUrl = STRIPE_PAYMENT_LINKS[paymentType];
      
      if (!paymentUrl || paymentUrl.includes('YOUR_')) {
        throw new Error('Payment links not configured. Please set up your Stripe payment links.');
      }
      
      // Redirect to Stripe payment link
      window.open(paymentUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Payment redirect error:', error);
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  return {
    processingPayment,
    redirectToPayment
  };
};