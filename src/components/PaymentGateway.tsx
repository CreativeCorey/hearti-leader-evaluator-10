
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { HEARTIAssessment } from '@/types';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

import { LoadingState } from './payment/LoadingState';
import { PaymentSuccess } from './payment/PaymentSuccess';
import { PaymentError } from './payment/PaymentError';
import { FeaturesList } from './payment/FeaturesList';
import { DebugInfo } from './payment/DebugInfo';
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
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [paymentAttemptCount, setPaymentAttemptCount] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState<number | null>(null);
  
  const { 
    processingPayment, 
    checkingPayment,
    hasPaid,
    paymentError,
    redirectToStripePayment,
    refreshPaymentStatus
  } = useAssessmentPayment(onPaymentComplete);

  const handlePayNow = async () => {
    try {
      const now = Date.now();
      setLastAttemptTime(now);
      setDebugInfo(`Starting payment process at ${new Date(now).toLocaleTimeString()}...`);
      setPaymentAttemptCount(prev => prev + 1);
      
      localStorage.removeItem('payment_error');
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      
      const result = await redirectToStripePayment(assessment);
      if (!result) {
        setDebugInfo(prev => `${prev}\nRedirection initiated, waiting...`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setDebugInfo(prev => `${prev}\nPayment process error: ${errorMessage}`);
      localStorage.setItem('payment_error', errorMessage);
      refreshPaymentStatus();
    }
  };
  
  const handleRefreshStatus = () => {
    setDebugInfo(prev => `${prev || ""}\nManually refreshing payment status at ${new Date().toLocaleTimeString()}...`);
    refreshPaymentStatus();
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
      
      <DebugInfo 
        debugInfo={debugInfo}
        paymentAttemptCount={paymentAttemptCount}
        lastAttemptTime={lastAttemptTime}
      />
      
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
