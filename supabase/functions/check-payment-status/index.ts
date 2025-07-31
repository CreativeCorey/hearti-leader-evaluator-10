
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    console.log("Starting payment status check");
    
    // Get any request body (might contain cache-busting timestamp)
    let body;
    try {
      body = await req.json();
      if (body.timestamp) {
        console.log("Request with timestamp:", body.timestamp);
      }
    } catch (e) {
      // No request body or invalid JSON
      body = {};
    }
    
    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("No authorization header provided");
      return new Response(JSON.stringify({ 
        hasPaid: false,
        paymentDetails: null,
        error: "No authentication provided",
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 200,
      });
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.id) {
      console.log("Authentication failed:", userError?.message || "No user found");
      // Return a non-error response for invalid sessions - user just hasn't paid
      return new Response(JSON.stringify({ 
        hasPaid: false,
        paymentDetails: null,
        error: null, // Don't return error for auth issues
        timestamp: Date.now()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 200,
      });
    }
    
    const user = userData.user;
    
    console.log("User authenticated:", user.id);

    // Use the service role key to create a new client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if payments table exists
    try {
      // Check if the user has paid
      console.log("Checking payments for user:", user.id);
      const { data: payments, error: paymentsError } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .order('created_at', { ascending: false })
        .limit(1);

      if (paymentsError) {
        // Special handling for table not existing
        if (paymentsError.message.includes("relation") && paymentsError.message.includes("does not exist")) {
          console.log("Payments table not found. Returning not paid status.");
          return new Response(JSON.stringify({ 
            hasPaid: false,
            paymentDetails: null,
            tableExists: false,
            error: "Payments table not set up",
            timestamp: Date.now() // Return timestamp for cache control
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
            status: 200,
          });
        }
        
        console.error("Database error:", paymentsError.message);
        throw new Error(`Database error: ${paymentsError.message}`);
      }
      
      console.log("Payment data retrieved:", payments ? payments.length : 0);

      return new Response(JSON.stringify({ 
        hasPaid: payments && payments.length > 0,
        paymentDetails: payments && payments.length > 0 ? payments[0] : null,
        tableExists: true,
        timestamp: Date.now() // Return timestamp for cache control
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
        status: 200,
      });
    } catch (dbError) {
      if (dbError instanceof Error && 
          dbError.message.includes("Database error") && 
          dbError.message.includes("does not exist")) {
        // Return a structured response for table not existing
        return new Response(JSON.stringify({ 
          hasPaid: false,
          paymentDetails: null,
          tableExists: false,
          error: "Payments table not set up",
          timestamp: Date.now() // Return timestamp for cache control
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
          status: 200,
        });
      }
      throw dbError; // Re-throw other errors
    }
  } catch (error) {
    console.error("Payment status check error:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      hasPaid: false,
      paymentDetails: null,
      timestamp: Date.now() // Return timestamp for cache control
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
      status: 500,
    });
  }
});
