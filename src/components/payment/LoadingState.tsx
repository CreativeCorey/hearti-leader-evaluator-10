
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = "Checking Payment Status" }: { message?: string }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{message}</CardTitle>
        <CardDescription>Please wait while we check your payment status...</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};
