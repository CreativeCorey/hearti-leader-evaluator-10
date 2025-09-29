
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
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
  onPayNow: (type: 'monthly' | 'annual' | 'oneTime') => void;
}

export const PaymentFooter = ({ processingPayment, user, lastAttemptTime, onPayNow }: PaymentFooterProps) => {
  const { toast } = useToast();
  const recentAttempt = lastAttemptTime && (Date.now() - lastAttemptTime < 3000);
  const buttonDisabled = processingPayment || !user || recentAttempt;
  
  
  const handleMainAction = (type: 'monthly' | 'oneTime') => {
    onPayNow(type);
  };
  
  
  return (
    <CardFooter className="flex flex-col gap-3">
      <div className="space-y-2 w-full">
        <Button 
          size="lg" 
          className="w-full"
          disabled={buttonDisabled}
          onClick={() => handleMainAction('monthly')}
        >
          {processingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening Payment Page...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Start for $19.99/month
            </>
          )}
        </Button>
        
        
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
          <DropdownMenuContent className="w-[280px]">
            <DropdownMenuItem onClick={() => onPayNow('annual')}>
              Annual subscription ($14.99/month, billed yearly at $179.88)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPayNow('oneTime')}>
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
            Opening Stripe payment page...
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
