
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { HEARTIAssessment } from '@/types';
import { usePaymentStatusCheck } from '@/hooks/payments/usePaymentStatusCheck';
import { usePaymentLinks } from '@/hooks/payments/usePaymentLinks';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { LoadingState } from './payment/LoadingState';
import { PaymentSuccess } from './payment/PaymentSuccess';
import { PaymentError } from './payment/PaymentError';
import { FeaturesList } from './payment/FeaturesList';
import { PaymentFooter } from './payment/PaymentFooter';

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
  
  const { 
    checkingPayment,
    hasPaid,
    paymentError,
    checkPaymentStatus
  } = usePaymentStatusCheck();
  
  const { processingPayment, redirectToPayment } = usePaymentLinks();

  // Add an initial payment status check
  useEffect(() => {
    if (!initialCheckDone && user) {
      checkPaymentStatus();
      setInitialCheckDone(true);
    }
  }, [initialCheckDone, user, checkPaymentStatus]);


  const handlePayNow = async (paymentType: 'monthly' | 'annual') => {
    try {
      const now = Date.now();
      setLastAttemptTime(now);
      
      const redirectSuccess = await redirectToPayment(assessment, paymentType);
      if (!redirectSuccess) {
        toast({
          title: "Payment Links Not Configured",
          description: "Please set up your Stripe payment links in the dashboard first.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "There was a problem starting the payment process. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRefreshStatus = () => {
    checkPaymentStatus();
    toast({
      title: "Refreshing",
      description: "Checking your payment status..."
    });
  };
  
  if (checkingPayment) {
    return <LoadingState />;
  }
  
  if (hasPaid) {
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
