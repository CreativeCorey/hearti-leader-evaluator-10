
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
};

// Helper function for logging to make debugging easier
const logStep = (message: string, details?: any) => {
  if (details) {
    console.log(`[create-payment] ${message}:`, typeof details === 'object' ? JSON.stringify(details) : details);
  } else {
    console.log(`[create-payment] ${message}`);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logStep("Starting payment creation process");

  // Get any request body 
  let body;
  try {
    body = await req.json();
    logStep("Request body", body);
  } catch (e) {
    logStep("Failed to parse request body", e);
    body = { timestamp: Date.now() };
  }

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      logStep("Auth error", userError.message);
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.email) {
      logStep("No user email found");
      throw new Error("User not authenticated or email not available");
    }
    
    logStep("User authenticated", { id: user.id, email: user.email });

    // Use the service role key to create a new client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Check if the payments table exists and if the user has already paid
    let userHasPaid = false;
    try {
      logStep("Checking existing payments");
      const { data: payments, error: paymentsError } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'paid')
        .limit(1);

      if (paymentsError) {
        logStep("Database error", paymentsError.message);
        // If the table doesn't exist, we'll proceed without checking existing payments
        if (!(paymentsError.message.includes("relation") && paymentsError.message.includes("does not exist"))) {
          throw paymentsError;
        }
      }

      if (payments && payments.length > 0) {
        logStep("User has already paid", payments[0]);
        userHasPaid = true;
        return new Response(JSON.stringify({ 
          paid: true, 
          message: "User has already paid for assessment results",
          timestamp: Date.now()
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    } catch (error) {
      // If there's an error checking payments, log it but continue
      logStep("Error checking payments, continuing", error.message);
    }

    // Initialize Stripe
    logStep("Initializing Stripe");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    logStep("Looking up Stripe customer");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { id: customerId });
    } else {
      // Create a new customer
      logStep("Creating new customer");
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_id: user.id
        }
      });
      customerId = newCustomer.id;
      logStep("Created new customer", { id: customerId });
    }

    // Get the origin from the request or use the provided one
    const origin = body.origin || req.headers.get("origin") || "http://localhost:3000";
    logStep("Using origin", origin);

    // Include assessment in the metadata if provided
    const metadata: Record<string, string> = {
      user_id: user.id
    };
    
    if (body.assessment) {
      try {
        metadata.assessment_id = body.assessment.id || 'unknown';
        metadata.assessment_date = body.assessment.date || new Date().toISOString();
        
        // Convert dimension scores to a string
        if (body.assessment.dimensionScores) {
          metadata.dimension_scores = JSON.stringify(body.assessment.dimensionScores);
        }
      } catch (metadataErr) {
        logStep("Could not add assessment data to metadata", metadataErr);
      }
    }

    // Create a one-time payment session
    logStep("Creating checkout session with metadata", metadata);
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
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: metadata
    });
    
    logStep("Checkout session created", { id: session.id });
    logStep("Checkout URL", session.url);

    try {
      // Try to create a pending payment record in the database
      logStep("Creating payment record");
      await supabaseAdmin.from('payments').insert({
        user_id: user.id,
        stripe_session_id: session.id,
        amount: 4900,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    } catch (dbError) {
      // If there's an error inserting into the payments table, log it but continue
      logStep("Error creating payment record, continuing", dbError.message);
    }

    // Return a proper response with the Stripe checkout URL and set cache control headers
    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      timestamp: Date.now() 
    }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json", 
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Payment creation error", errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: Date.now()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
