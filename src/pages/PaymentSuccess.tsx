
import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useAssessmentPayment } from '@/hooks/useAssessmentPayment';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  
  const { verifyPayment } = useAssessmentPayment((assessment) => {
    console.log("Payment verification complete, assessment loaded:", assessment);
  });
  
  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setVerifying(false);
        return;
      }
      
      try {
        const result = await verifyPayment(sessionId);
        setVerified(result);
        
        if (result) {
          // Redirect to home after 2 seconds on success
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to verify payment');
      } finally {
        setVerifying(false);
      }
    };
    
    verifySession();
  }, [sessionId, verifyPayment]);
  
  if (!sessionId) {
    return <Navigate to="/" replace />;
  }
  
  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Verifying Your Payment</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive flex items-center justify-center gap-2">
              <XCircle className="h-6 w-6" />
              Payment Verification Failed
            </CardTitle>
            <CardDescription>We couldn't verify your payment</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-4">
            <p className="mb-4">{error}</p>
            <p>If you believe this is an error, please contact support.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-primary flex items-center justify-center gap-2">
              <CheckCircle2 className="h-6 w-6" />
              Payment Successful!
            </CardTitle>
            <CardDescription>Thank you for your purchase</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-4">
            <p className="mb-4">Your assessment results are now available.</p>
            <p>You can now access all your assessment results and development resources.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.href = '/'}>
              View Your Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-destructive flex items-center justify-center gap-2">
            <XCircle className="h-6 w-6" />
            Payment Not Confirmed
          </CardTitle>
          <CardDescription>We couldn't confirm your payment status</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-4">
          <p>The payment may still be processing. Please check back in a few minutes.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
