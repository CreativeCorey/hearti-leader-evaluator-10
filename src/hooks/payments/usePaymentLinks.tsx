import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HEARTIAssessment } from '@/types';

// Stripe Price IDs for monthly and annual subscriptions
const STRIPE_PRICES = {
  monthly: 'price_1Rw6RoCCli0zGv17MTb41FUA',
  annual: 'price_1RvSLECCli0zGv17dNOcTYYY'
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

      console.log('Creating checkout session for:', paymentType, 'with price:', STRIPE_PRICES[paymentType]);

      // Create checkout session via edge function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: STRIPE_PRICES[paymentType],
          email: session.user.email
        }
      });

      console.log('Checkout session response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Failed to create checkout session: ${error.message || 'Unknown error'}`);
      }
      
      if (!data?.url) {
        console.error('No checkout URL in response:', data);
        throw new Error('No checkout URL received from Stripe');
      }

      console.log('Redirecting to Stripe checkout:', data.url);
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
      
      return true;
    } catch (error) {
      console.error('Payment redirect error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start payment process';
      localStorage.setItem('payment_error', errorMessage);
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