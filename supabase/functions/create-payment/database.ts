
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (message: string, details?: any) => {
  if (details) {
    console.log(`[create-payment] ${message}:`, typeof details === 'object' ? JSON.stringify(details) : details);
  } else {
    console.log(`[create-payment] ${message}`);
  }
};

export const createPaymentRecord = async (params: {
  userId: string;
  sessionId: string;
  amount: number;
  type: 'one-time' | 'subscription';
}) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    
    logStep("Creating payment record using secure function");
    const { data, error: dbError } = await supabaseAdmin
      .rpc('create_payment_secure', {
        p_user_id: params.userId,
        p_stripe_session_id: params.sessionId,
        p_amount: params.amount,
        p_status: 'pending'
      });
      
    if (dbError) {
      if (dbError.message.includes("relation") && dbError.message.includes("does not exist")) {
        logStep("Payments table doesn't exist, skipping record creation");
      } else {
        logStep("Error creating payment record", dbError);
      }
    } else {
      logStep("Payment record created successfully", { paymentId: data });
    }
  } catch (error) {
    logStep("Error creating payment record", error);
  }
};
