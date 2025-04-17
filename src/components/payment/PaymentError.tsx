
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface PaymentErrorProps {
  error: string;
  onRefresh: () => void;
}

export const PaymentError = ({ error, onRefresh }: PaymentErrorProps) => {
  return (
    <CardContent className="pt-0 pb-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="mt-2"
            >
              Refresh Payment Status
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </CardContent>
  );
};
