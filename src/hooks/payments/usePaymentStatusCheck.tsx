
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { checkPaymentStatusFromAPI, validatePaymentData } from '@/utils/payment/paymentStatus';
import { handlePaymentError, handlePaymentStatusError } from '@/utils/payment/paymentErrors';
import { supabase } from '@/integrations/supabase/client';

export const usePaymentStatusCheck = () => {
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [hasPaid, setHasPaid] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'admin' | 'subscriber' | 'unsubscribed'>('admin');
  const { user } = useAuth();
  const { toast } = useToast();

  // Check user role on mount
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        
        setUserRole(profile?.role || 'user');
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      }
    };

    fetchUserRole();
  }, [user]);

  const checkPaymentStatus = useCallback(async () => {
    if (!user) {
      console.log("No user found, skipping payment status check");
      setCheckingPayment(false);
      return;
    }

    // Super admins have automatic access unless they're in a different view mode
    if (userRole === 'super_admin') {
      if (viewMode === 'admin' || viewMode === 'subscriber') {
        setHasPaid(true);
        setCheckingPayment(false);
        return;
      } else if (viewMode === 'unsubscribed') {
        setHasPaid(false);
        setCheckingPayment(false);
        return;
      }
    }
    
    try {
      setCheckingPayment(true);
      setPaymentError(null);
      
      console.log("Checking payment status for user:", user.id);
      const { data, error } = await checkPaymentStatusFromAPI(Date.now());
      
      if (error) {
        console.log("Payment status check error (non-critical):", error);
        // For authentication errors, just assume user hasn't paid
        setHasPaid(false);
        setPaymentError(null); // Don't show error for auth issues
        return;
      }
      
      const validationError = validatePaymentData(data);
      if (validationError) {
        console.log("Payment validation warning:", validationError);
        setPaymentError(null); // Don't show validation errors as user errors
      }
      
      setHasPaid(data.hasPaid);
      console.log("Payment status:", data.hasPaid ? "Paid" : "Not paid", data);
      
    } catch (error) {
      console.log("Payment check failed (treating as unpaid):", error);
      // Don't show errors for payment checks - just assume unpaid
      setHasPaid(false);
      setPaymentError(null);
    } finally {
      setCheckingPayment(false);
    }
  }, [user, toast, userRole, viewMode]);

  return {
    checkingPayment,
    hasPaid,
    paymentError,
    checkPaymentStatus,
    userRole,
    viewMode,
    setViewMode
  };
};

