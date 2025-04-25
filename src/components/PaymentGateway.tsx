import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { HEARTIAssessment } from '@/types';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, ExternalLink } from 'lucide-react';

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
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [manualPaymentUrl, setManualPaymentUrl] = useState<string | null>(null);
  
  const { 
    processingPayment, 
    checkingPayment,
    hasPaid,
    paymentError,
    redirectToStripePayment,
    refreshPaymentStatus
  } = useAssessmentPayment(onPaymentComplete);

  // Add an initial payment status check
  useEffect(() => {
    if (!initialCheckDone && user) {
      refreshPaymentStatus();
      setInitialCheckDone(true);
    }
  }, [initialCheckDone, user, refreshPaymentStatus]);

  // Check for stored payment URL
  useEffect(() => {
    const checkPaymentUrl = () => {
      const storedUrl = localStorage.getItem('stripe_payment_url');
      if (storedUrl) {
        setManualPaymentUrl(storedUrl);
      }
    };
    
    // Check initially and set up an interval to keep checking
    checkPaymentUrl();
    const intervalId = setInterval(checkPaymentUrl, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handlePayNow = async (paymentType: 'one-time' | 'subscription') => {
    try {
      const now = Date.now();
      setLastAttemptTime(now);
      setDebugInfo(`Starting ${paymentType} payment process at ${new Date(now).toLocaleTimeString()}...`);
      setPaymentAttemptCount(prev => prev + 1);
      
      localStorage.removeItem('payment_error');
      localStorage.setItem('pending_assessment', JSON.stringify(assessment));
      
      const redirectSuccess = await redirectToStripePayment(assessment, paymentType);
      if (!redirectSuccess) {
        setDebugInfo(prev => `${prev || ""}\nRedirect was not successful. Please try the manual redirect button.`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setDebugInfo(prev => `${prev || ""}\nPayment process error: ${errorMessage}`);
      localStorage.setItem('payment_error', errorMessage);
      refreshPaymentStatus();
    }
  };
  
  const handleRefreshStatus = () => {
    setDebugInfo(prev => `${prev || ""}\nManually refreshing payment status at ${new Date().toLocaleTimeString()}...`);
    refreshPaymentStatus();
  };
  
  const handleManualRedirect = () => {
    if (manualPaymentUrl) {
      window.open(manualPaymentUrl, '_blank');
      setDebugInfo(prev => `${prev || ""}\nTried manual redirect at ${new Date().toLocaleTimeString()}`);
    }
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
      
      {manualPaymentUrl && !processingPayment && (
        <div className="px-6 py-3 mx-6 mb-4 bg-amber-50 border border-amber-300 rounded-md text-amber-800 shadow-sm">
          <p className="font-medium mb-2">Having trouble? Try our alternative payment method:</p>
          <Button
            variant="default"
            size="sm"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleManualRedirect}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Payment Page Directly
          </Button>
        </div>
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
