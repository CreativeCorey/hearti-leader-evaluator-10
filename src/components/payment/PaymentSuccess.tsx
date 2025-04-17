
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export const PaymentSuccess = () => {
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
};
