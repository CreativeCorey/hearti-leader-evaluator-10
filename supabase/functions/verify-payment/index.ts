
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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

  console.log("Starting payment verification");

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Get the session ID from the request body
    const body = await req.json();
    const { sessionId } = body;
    
    // Log timestamp if provided (for cache busting)
    if (body.timestamp) {
      console.log("Request with timestamp:", body.timestamp);
    }
    
    if (!sessionId) {
      console.error("No session ID provided");
      throw new Error("Session ID is required");
    }
    console.log("Verifying session ID:", sessionId);

    // Authenticate the user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      console.error("Auth error:", userError.message);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.id) {
      console.error("No user found");
      throw new Error("User not authenticated");
    }
    console.log("User authenticated:", user.id);

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session from Stripe
    console.log("Retrieving Stripe session");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      console.error("Session not found");
      throw new Error("Session not found");
    }
    console.log("Session retrieved, status:", session.payment_status);

    // Use the service role key to create a new client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Try to update the payment record in the database using secure function
    if (session.payment_status === 'paid') {
      try {
        console.log("Updating payment record to paid using secure function");
        const { data, error: updateError } = await supabaseAdmin
          .rpc('update_payment_status_secure', {
            p_stripe_session_id: session.id,
            p_status: 'paid'
          });
          
        if (updateError) {
          // If the function doesn't exist, we'll just log it and continue
          if (updateError.message.includes("function") && updateError.message.includes("does not exist")) {
            console.log("Secure payment function doesn't exist, skipping update");
          } else {
            console.error("Error updating payment record:", updateError);
          }
        } else {
          console.log("Payment record update result:", data);
        }
      } catch (dbError) {
        // If there's an error updating the payments table, log it but continue
        const dbErrorMessage = dbError instanceof Error ? dbError.message : 'Unknown error'
        console.log("Error updating payment record, continuing:", dbErrorMessage);
      }
    }

    return new Response(JSON.stringify({ 
      paid: session.payment_status === 'paid',
      status: session.payment_status,
      timestamp: Date.now() // Return timestamp for cache control
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payment verification error:", errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: Date.now() // Return timestamp for cache control
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
      status: 500,
    });
  }
});
