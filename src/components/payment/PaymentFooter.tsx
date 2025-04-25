
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, ExternalLink, AlertCircle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentFooterProps {
  processingPayment: boolean;
  user: User | null;
  lastAttemptTime: number | null;
  onPayNow: (type: 'one-time' | 'subscription') => void;
}

export const PaymentFooter = ({ processingPayment, user, lastAttemptTime, onPayNow }: PaymentFooterProps) => {
  const recentAttempt = lastAttemptTime && (Date.now() - lastAttemptTime < 3000);
  const buttonDisabled = processingPayment || !user || recentAttempt;
  
  // Check if there's a stored payment URL from a previous attempt
  const storedPaymentUrl = typeof window !== 'undefined' ? localStorage.getItem('stripe_payment_url') : null;
  
  const handleManualRedirect = () => {
    if (storedPaymentUrl) {
      // Using _blank for manual redirect to ensure a fresh context
      window.open(storedPaymentUrl, '_blank');
    }
  };
  
  return (
    <CardFooter className="flex flex-col gap-3">
      <div className="space-y-2 w-full">
        <Button 
          size="lg" 
          className={`w-full ${processingPayment ? 'bg-primary/80 hover:bg-primary/80' : ''}`}
          disabled={buttonDisabled}
          onClick={() => onPayNow('subscription')}
        >
          {processingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {recentAttempt ? 'Preparing Payment...' : 'Redirecting to Stripe...'}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Start for $6.99/month
            </>
          )}
        </Button>
        
        {storedPaymentUrl && (
          <Button 
            variant="default" 
            size="lg"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white border-amber-400"
            onClick={handleManualRedirect}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Payment Page Now
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              disabled={buttonDisabled}
            >
              See other payment options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px]">
            <DropdownMenuItem onClick={() => onPayNow('one-time')}>
              Full Access - One Payment: $54.00
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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
            If redirection doesn't happen automatically, please use the orange button above.
          </p>
        </div>
      )}
      
      {recentAttempt && !processingPayment && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Please wait a moment before trying again.
        </p>
      )}
    </CardFooter>
  );
};
