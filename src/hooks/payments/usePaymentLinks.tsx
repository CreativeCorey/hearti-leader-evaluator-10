import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

// Stripe Price IDs for monthly and annual subscriptions
const STRIPE_PRICES = {
  monthly: 'price_1QkfOyQWCMFpjF8cZR0o9Wf6',
  annual: 'price_1QkfPrQWCMFpjF8cNBo8lLLI'
};

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
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Create checkout session via edge function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: STRIPE_PRICES[paymentType],
          email: session.user.email
        }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL received');

      // Redirect to Stripe checkout
      window.location.href = data.url;
      
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