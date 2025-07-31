import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("Starting secure payment status check");
    
    // SECURITY: Strict authentication required
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing or invalid authorization header");
      return new Response(JSON.stringify({ 
        error: "Authentication required",
        hasPaid: false,
        paymentDetails: null,
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 401,
      });
    }
    
    const token = authHeader.replace("Bearer ", "");
    
    // SECURITY: Validate token format
    if (!token || token.length < 10) {
      console.log("Invalid token format");
      return new Response(JSON.stringify({ 
        error: "Invalid authentication token",
        hasPaid: false,
        paymentDetails: null,
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 401,
      });
    }
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.id) {
      console.log("Authentication failed:", userError?.message || "No user found");
      return new Response(JSON.stringify({ 
        error: "Authentication failed",
        hasPaid: false,
        paymentDetails: null,
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 401,
      });
    }
    
    const user = userData.user;
    console.log("User authenticated:", user.id);

    // Use the service role key to create a new client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { 
        auth: { persistSession: false },
        global: {
          headers: {
            'X-Client-Info': 'secure-payment-status-function'
          }
        }
      }
    );

    // SECURITY: Use parameterized queries and validate user ID format
    if (!user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.log("Invalid user ID format");
      return new Response(JSON.stringify({ 
        error: "Invalid user ID",
        hasPaid: false,
        paymentDetails: null,
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 400,
      });
    }

    try {
      console.log("Checking payments for user:", user.id);
      const { data: payments, error: paymentsError } = await supabaseAdmin
        .from('payments')
        .select('id, amount, status, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(1);

      if (paymentsError) {
        if (paymentsError.message.includes("relation") && paymentsError.message.includes("does not exist")) {
          console.log("Payments table not found");
          return new Response(JSON.stringify({ 
            hasPaid: false,
            paymentDetails: null,
            tableExists: false,
            error: "Payments system not configured",
            timestamp: Date.now()
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
            status: 200,
          });
        }
        
        console.error("Database error:", paymentsError.message);
        return new Response(JSON.stringify({ 
          error: "Database error occurred",
          hasPaid: false,
          paymentDetails: null,
          timestamp: Date.now()
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
          status: 500,
        });
      }
      
      console.log("Payment data retrieved:", payments ? payments.length : 0);

      const hasValidPayment = payments && payments.length > 0;
      const paymentDetails = hasValidPayment ? {
        id: payments[0].id,
        amount: payments[0].amount,
        status: payments[0].status,
        created_at: payments[0].created_at
      } : null;

      return new Response(JSON.stringify({ 
        hasPaid: hasValidPayment,
        paymentDetails,
        tableExists: true,
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 200,
      });
      
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return new Response(JSON.stringify({ 
        error: "Database operation failed",
        hasPaid: false,
        paymentDetails: null,
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 500,
      });
    }
  } catch (error) {
    console.error("Payment status check error:", error.message);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      hasPaid: false,
      paymentDetails: null,
      timestamp: Date.now()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
      status: 500,
    });
  }
});