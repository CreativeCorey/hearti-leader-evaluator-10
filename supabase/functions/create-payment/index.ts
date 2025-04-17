
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

  console.log("Starting payment creation process");

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

  // Create Supabase client using the anon key for user authentication.
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      console.error("Auth error:", userError.message);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.email) {
      console.error("No user email found");
      throw new Error("User not authenticated or email not available");
    }
    
    console.log("User authenticated:", user.id);

    // Use the service role key to create a new client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if the payments table exists and if the user has already paid
    let userHasPaid = false;
    try {
      console.log("Checking existing payments");
      const { data: payments, error: paymentsError } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .limit(1);

      if (paymentsError) {
        console.error("Database error:", paymentsError.message);
        // If the table doesn't exist, we'll proceed without checking existing payments
        if (!(paymentsError.message.includes("relation") && paymentsError.message.includes("does not exist"))) {
          throw paymentsError;
        }
      }

      if (payments && payments.length > 0) {
        console.log("User has already paid");
        userHasPaid = true;
        return new Response(JSON.stringify({ 
          paid: true, 
          message: "User has already paid for assessment results",
          timestamp: Date.now()
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
          status: 200,
        });
      }
    } catch (error) {
      // If there's an error checking payments, log it but continue
      // This handles cases where the payments table doesn't exist yet
      console.log("Error checking payments, continuing:", error.message);
    }

    // Initialize Stripe
    console.log("Initializing Stripe");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    console.log("Looking up Stripe customer");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      // Create a new customer
      console.log("Creating new customer");
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_id: user.id
        }
      });
      customerId = newCustomer.id;
      console.log("Created new customer:", customerId);
    }

    // Create a one-time payment session
    console.log("Creating checkout session");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "HEARTI™ Leadership Assessment Results" 
            },
            unit_amount: 4900, // $49.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/`,
      metadata: {
        user_id: user.id
      }
    });
    
    console.log("Checkout session created:", session.id);

    try {
      // Try to create a pending payment record in the database
      // This might fail if the table doesn't exist, but we'll handle it gracefully
      console.log("Creating payment record");
      await supabaseAdmin.from('payments').insert({
        user_id: user.id,
        stripe_session_id: session.id,
        amount: 4900,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    } catch (dbError) {
      // If there's an error inserting into the payments table, log it but continue
      console.log("Error creating payment record, continuing:", dbError.message);
    }

    return new Response(JSON.stringify({ url: session.url, timestamp: Date.now() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Payment creation error:", errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: Date.now()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
      status: 500,
    });
  }
});
