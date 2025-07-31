
import { toast } from '@/hooks/use-toast';

export const handlePaymentError = (error: any, setPaymentError: (error: string | null) => void) => {
  console.error("Payment status check error:", error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Don't show errors for normal "no payment" scenarios
  if (errorMessage.includes("User has not made any payments") || 
      errorMessage.includes("Authentication error") ||
      errorMessage.includes("Payments table not set up")) {
    console.log("Normal payment check - user hasn't paid yet");
    setPaymentError(null);
    return;
  }
  
  setPaymentError("Failed to connect to payment service");
  toast({
    title: "Error",
    description: "Failed to check payment status. Please try again.",
    variant: "destructive"
  });
};

export const handlePaymentStatusError = (error: any, setPaymentError: (error: string | null) => void) => {
  console.error("Payment status error:", error);
  setPaymentError(error);
  toast({
    title: "Error",
    description: error || "Failed to check payment status",
    variant: "destructive"
  });
};

