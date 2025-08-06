
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { HEARTIAssessment } from '@/types';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { LoadingState } from './payment/LoadingState';
import { PaymentSuccess } from './payment/PaymentSuccess';
import { PaymentError } from './payment/PaymentError';
import { FeaturesList } from './payment/FeaturesList';
import { PaymentFooter } from './payment/PaymentFooter';
import { PromoCodeInput } from './payment/PromoCodeInput';
import { usePromoCode } from '@/hooks/usePromoCode';

interface PaymentGatewayProps {
  assessment: HEARTIAssessment;
  onPaymentComplete: (assessment: HEARTIAssessment) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ 
  assessment, 
  onPaymentComplete 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const { hasTrialAccess, checkActiveTrialStatus } = usePromoCode();
  
  
  const { 
    processingPayment, 
    checkingPayment,
    hasPaid,
    paymentError,
    redirectToStripePayment,
    refreshPaymentStatus
  } = useAssessmentPayment(onPaymentComplete);

  // Add an initial payment status check and trial status check
  useEffect(() => {
    if (!initialCheckDone && user) {
      refreshPaymentStatus();
      checkActiveTrialStatus();
      setInitialCheckDone(true);
    }
  }, [initialCheckDone, user, refreshPaymentStatus, checkActiveTrialStatus]);


  const handlePayNow = async (paymentType: 'one-time' | 'subscription' | 'annual-subscription') => {
    try {
      const now = Date.now();
      setLastAttemptTime(now);
      
      localStorage.removeItem('payment_error');
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      
      // Attempt to redirect to Stripe payment
      const redirectSuccess = await redirectToStripePayment(assessment, paymentType);
      if (!redirectSuccess) {
        toast({
          title: "Redirect Failed",
          description: "Could not start the payment process. Please try again.",
          variant: "destructive"
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      localStorage.setItem('payment_error', errorMessage);
      refreshPaymentStatus();
      toast({
        title: "Payment Error",
        description: "There was a problem starting the payment process. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRefreshStatus = () => {
    refreshPaymentStatus();
    toast({
      title: "Refreshing",
      description: "Checking your payment status..."
    });
  };
  
  if (checkingPayment) {
    return <LoadingState />;
  }
  
  if (hasPaid || hasTrialAccess()) {
    return <PaymentSuccess />;
  }
  
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
        <PaymentError 
          error={paymentError} 
          onRefresh={handleRefreshStatus} 
        />
      )}
      
      
      <div className="px-6 space-y-4">
        <PromoCodeInput onPromoApplied={() => {
          checkActiveTrialStatus();
          refreshPaymentStatus();
        }} />
      </div>
      
      <FeaturesList />
      
      <PaymentFooter
        processingPayment={processingPayment}
        user={user}
        lastAttemptTime={lastAttemptTime}
        onPayNow={handlePayNow}
      />
    </Card>
  );
};

export default PaymentGateway;
