
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { HEARTIAssessment } from '@/types';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock, CreditCard, RefreshCw, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PaymentGatewayProps {
  assessment: HEARTIAssessment;
  onPaymentComplete: (assessment: HEARTIAssessment) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ 
  assessment, 
  onPaymentComplete 
}) => {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [paymentAttemptCount, setPaymentAttemptCount] = useState(0);
  
  const { 
    processingPayment, 
    checkingPayment,
    hasPaid,
    paymentError,
    redirectToStripePayment,
    refreshPaymentStatus
  } = useAssessmentPayment(onPaymentComplete);

  // Add effect to periodically refresh payment status
  useEffect(() => {
    // Only do periodic refresh if we're not already checking and there's no payment in progress
    if (!checkingPayment && !processingPayment && !hasPaid && user) {
      const intervalId = setInterval(() => {
        console.log("Auto-refreshing payment status");
        refreshPaymentStatus();
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [checkingPayment, processingPayment, hasPaid, user, refreshPaymentStatus]);

  const handlePayNow = async () => {
    try {
      setDebugInfo("Starting payment process...");
      setPaymentAttemptCount(prev => prev + 1);
      
      // Clear any previous payment error
      localStorage.removeItem('payment_error');
      
      // Store assessment before payment
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      
      await redirectToStripePayment(assessment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setDebugInfo(`Payment process error: ${errorMessage}`);
      localStorage.setItem('payment_error', errorMessage);
    }
  };
  
  const handleRefreshStatus = () => {
    setDebugInfo("Manually refreshing payment status...");
    refreshPaymentStatus();
  };
  
  // Show loading state while checking payment status
  if (checkingPayment) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Checking Payment Status</CardTitle>
          <CardDescription>Please wait while we check your payment status...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // If user has already paid, show a success message
  if (hasPaid) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Payment Complete</CardTitle>
          <CardDescription>You already have access to your assessment results</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-full mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <p className="text-center">
            Thank you for your purchase! You have full access to your assessment results.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Otherwise, show the payment gateway
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center">
          <CardTitle>Unlock Your Assessment Results</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefreshStatus} 
            title="Refresh payment status"
            disabled={checkingPayment}
          >
            {checkingPayment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          Complete your payment to access your full HEARTI™ Leadership results and personalized growth plan
        </CardDescription>
      </CardHeader>
      
      {paymentError && (
        <CardContent className="pt-0 pb-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {paymentError}
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshStatus}
                  className="mt-2"
                >
                  Refresh Payment Status
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
      
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">What's included:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
              <span>Detailed assessment of all 6 leadership skills</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
              <span>Personalized development activities</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
              <span>Progress tracking and habit builder tools</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
              <span>Compare your scores with industry benchmarks</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full bg-primary h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5">✓</div>
              <span>Export your results and share with your team</span>
            </li>
          </ul>
        </div>
        
        <div className="text-center pt-4">
          <p className="text-2xl font-bold">$49.00</p>
          <p className="text-sm text-muted-foreground">One-time payment, lifetime access</p>
        </div>

        {(debugInfo || paymentAttemptCount > 0) && (
          <div className="mt-4 p-2 border border-amber-200 bg-amber-50 rounded text-xs">
            <p className="font-semibold">Debug info:</p>
            <pre className="whitespace-pre-wrap break-words">
              {debugInfo || "No additional debug info"}
              {paymentAttemptCount > 0 && `\nPayment attempts: ${paymentAttemptCount}`}
              {localStorage.getItem('payment_error') && 
                `\nLast error: ${localStorage.getItem('payment_error')}`}
            </pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          size="lg" 
          className="w-full"
          onClick={handlePayNow}
          disabled={processingPayment || !user}
        >
          {processingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
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
            <Button variant="link" className="p-0 h-auto text-sm" onClick={() => window.location.href = '/auth'}>
              Sign in
            </Button>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default PaymentGateway;
