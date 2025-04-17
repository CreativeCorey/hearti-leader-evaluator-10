
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, ExternalLink } from 'lucide-react';
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
  const buttonDisabled = processingPayment || !user || recentAttempt;
  
  return (
    <CardFooter className="flex flex-col gap-3">
      <Button 
        size="lg" 
        className={`w-full ${processingPayment ? 'bg-primary/80 hover:bg-primary/80' : ''}`}
        onClick={onPayNow}
        disabled={buttonDisabled}
      >
        {processingPayment ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Stripe...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now {lastAttemptTime ? `(Last Attempt: ${new Date(lastAttemptTime).toLocaleTimeString()})` : ''}
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
        <div className="text-xs text-muted-foreground mt-2 text-center space-y-2">
          <p>
            You will be redirected to Stripe's secure payment page.
          </p>
          <p className="flex items-center justify-center">
            <ExternalLink className="h-3 w-3 mr-1" />
            If redirection doesn't happen automatically, check your browser's popup settings.
          </p>
        </div>
      )}
      
      {recentAttempt && !processingPayment && (
        <p className="text-xs text-amber-600">
          Please wait a moment before trying again.
        </p>
      )}
    </CardFooter>
  );
};
