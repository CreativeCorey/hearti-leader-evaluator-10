
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface PaymentFooterProps {
  processingPayment: boolean;
  user: User | null;
  lastAttemptTime: number | null;
  onPayNow: () => void;
}

export const PaymentFooter = ({ processingPayment, user, lastAttemptTime, onPayNow }: PaymentFooterProps) => {
  // Calculate if the button should be disabled due to a recent payment attempt
  const recentAttempt = lastAttemptTime && (Date.now() - lastAttemptTime < 3000);
  
  return (
    <CardFooter className="flex flex-col gap-3">
      <Button 
        size="lg" 
        className="w-full"
        onClick={onPayNow}
        disabled={processingPayment || !user || recentAttempt}
      >
        {processingPayment ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Stripe...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>
      
      {!user && (
        <p className="text-sm text-destructive">
          You need to be signed in to make a payment. 
          <Button variant="link" className="p-0 h-auto text-sm ml-1" onClick={() => window.location.href = '/auth'}>
            Sign in
          </Button>
        </p>
      )}
      
      {processingPayment && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          You will be redirected to Stripe's secure payment page.
          If redirection doesn't happen automatically, check your browser's popup settings.
        </p>
      )}
    </CardFooter>
  );
};
