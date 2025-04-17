
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
    
    logStep("Creating payment record");
    const { error: dbError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: params.userId,
        stripe_session_id: params.sessionId,
        amount: params.amount,
        type: params.type,
        status: 'pending',
        created_at: new Date().toISOString()
      });
      
    if (dbError) {
      if (dbError.message.includes("relation") && dbError.message.includes("does not exist")) {
        logStep("Payments table doesn't exist, skipping record creation");
      } else {
        logStep("Error creating payment record", dbError);
      }
    }
  } catch (error) {
    logStep("Error creating payment record", error);
  }
};
