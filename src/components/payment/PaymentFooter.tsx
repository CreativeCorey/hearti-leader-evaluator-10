
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, ExternalLink } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface PaymentFooterProps {
  processingPayment: boolean;
  user: User | null;
  lastAttemptTime: number | null;
  onPayNow: (type: 'one-time' | 'subscription' | 'annual-subscription') => void;
}

export const PaymentFooter = ({ processingPayment, user, lastAttemptTime, onPayNow }: PaymentFooterProps) => {
  const { toast } = useToast();
  const recentAttempt = lastAttemptTime && (Date.now() - lastAttemptTime < 3000);
  const buttonDisabled = processingPayment || !user || recentAttempt;
  
  // Check if there's a stored payment URL from a previous attempt
  const [storedPaymentUrl, setStoredPaymentUrl] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Check on mount and whenever processing status changes
    const checkStoredUrl = () => {
      const url = typeof window !== 'undefined' ? localStorage.getItem('stripe_payment_url') : null;
      setStoredPaymentUrl(url);
    };
    
    checkStoredUrl();
    
    // Also set up an interval to check regularly
    const intervalId = setInterval(checkStoredUrl, 1000);
    return () => clearInterval(intervalId);
  }, [processingPayment]);
  
  const handleMainAction = (type: 'subscription' | 'one-time') => {
    // Just prepare the payment, no automatic redirect
    onPayNow(type);
  };
  
  const handleManualRedirect = () => {
    if (storedPaymentUrl) {
      console.log("Manual redirect to:", storedPaymentUrl);
      
      try {
        // Direct location change for reliable navigation
        window.location.href = storedPaymentUrl;
        
        toast({
          title: "Redirecting to Stripe",
          description: "You're being redirected to complete your payment.",
        });
      } catch (e) {
        console.error("Redirect error:", e);
        
        // Fallback: copy URL to clipboard if navigation fails
        try {
          navigator.clipboard.writeText(storedPaymentUrl);
          toast({
            title: "Redirect Failed",
            description: "Payment URL copied to clipboard. Please paste it in your browser address bar.",
            variant: "destructive"
          });
        } catch (clipboardError) {
          toast({
            title: "Redirect Failed",
            description: "Could not navigate to payment page. Please try again later.",
            variant: "destructive"
          });
        }
      }
    } else {
      toast({
        title: "No Payment URL Available",
        description: "Please click the main payment button first to generate a payment link.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <CardFooter className="flex flex-col gap-3">
      <div className="space-y-2 w-full">
        <Button 
          size="lg" 
          className="w-full"
          disabled={buttonDisabled}
          onClick={() => handleMainAction('subscription')}
        >
          {processingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {recentAttempt ? 'Preparing Payment...' : 'Preparing Payment...'}
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Start for $9.99/month
            </>
          )}
        </Button>
        
        {storedPaymentUrl && (
          <Button 
            variant="outline" 
            size="lg"
            className="w-full bg-amber-50 text-amber-600 border-amber-400 hover:bg-amber-100 font-bold"
            onClick={handleManualRedirect}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Go To Payment Page Now
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
            <DropdownMenuItem onClick={() => onPayNow('annual-subscription')}>
              Annual subscription ($7.99/month, billed yearly)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPayNow('one-time')}>
              Full Access - One Payment: $199.99
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
            Payment is being prepared. Click the manual redirect button when it appears.
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
