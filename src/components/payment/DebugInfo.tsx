
import React from 'react';
import { CardContent } from '@/components/ui/card';

interface DebugInfoProps {
  debugInfo: string | null;
  paymentAttemptCount: number;
  lastAttemptTime: number | null;
}

export const DebugInfo = ({ debugInfo, paymentAttemptCount, lastAttemptTime }: DebugInfoProps) => {
  if (!(debugInfo || paymentAttemptCount > 0 || lastAttemptTime)) {
    return null;
  }

  return (
    <CardContent className="mt-4 p-2 border border-amber-200 bg-amber-50 rounded text-xs">
      <p className="font-semibold">Debug info:</p>
      <pre className="whitespace-pre-wrap break-words">
        {debugInfo || "No additional debug info"}
        {paymentAttemptCount > 0 && `\nPayment attempts: ${paymentAttemptCount}`}
        {lastAttemptTime && `\nLast attempt: ${new Date(lastAttemptTime).toLocaleString()}`}
        {localStorage.getItem('payment_error') && 
          `\nLast error: ${localStorage.getItem('payment_error')}`}
      </pre>
    </CardContent>
  );
};
