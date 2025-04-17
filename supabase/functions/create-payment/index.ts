
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

// Helper function for logging
const logStep = (message: string, details?: any) => {
  if (details) {
    console.log(`[create-payment] ${message}:`, typeof details === 'object' ? JSON.stringify(details) : details);
  } else {
    console.log(`[create-payment] ${message}`);
  }
};

// Function to initialize Supabase client
const initializeSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
};

// Function to authenticate user
const authenticateUser = async (authHeader: string | null) => {
  if (!authHeader) {
    throw new Error("No authorization header provided");
  }
  
  const supabaseClient = initializeSupabaseClient();
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
  
  return user;
};

// Function to initialize Stripe
const initializeStripe = () => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  
  return new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });
};

// Function to get or create Stripe customer
const getOrCreateStripeCustomer = async (stripe: Stripe, user: { id: string; email: string }) => {
  logStep("Looking up Stripe customer");
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  
  if (customers.data.length > 0) {
    const customerId = customers.data[0].id;
    logStep("Found existing customer", { id: customerId });
    return customerId;
  }
  
  logStep("Creating new customer");
  const newCustomer = await stripe.customers.create({
    email: user.email,
    metadata: {
      supabase_id: user.id
    }
  });
  logStep("Created new customer", { id: newCustomer.id });
  return newCustomer.id;
};

// Function to create checkout session
const createCheckoutSession = async (stripe: Stripe, params: {
  customerId: string,
  origin: string,
  metadata: Record<string, string>
}) => {
  logStep("Creating checkout session with metadata", params.metadata);
  
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
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
    success_url: `${params.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/`,
    metadata: params.metadata
  });
  
  logStep("Checkout session created", { id: session.id });
  logStep("Checkout URL", session.url);
  
  return session;
};

// Function to create payment record in database
const createPaymentRecord = async (params: {
  userId: string,
  sessionId: string,
  amount: number
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
        status: 'pending',
        created_at: new Date().toISOString()
      });
      
    if (dbError) {
      // If the table doesn't exist, log it but continue
      if (dbError.message.includes("relation") && dbError.message.includes("does not exist")) {
        logStep("Payments table doesn't exist, skipping record creation");
      } else {
        logStep("Error creating payment record", dbError);
      }
    }
  } catch (error) {
    // Log error but don't throw - payment record is non-critical
    logStep("Error creating payment record", error);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logStep("Starting payment creation process");

  // Get request body
  let body;
  try {
    body = await req.json();
    logStep("Request body", body);
  } catch (e) {
    logStep("Failed to parse request body", e);
    body = { timestamp: Date.now() };
  }

  try {
    // Authenticate user
    const user = await authenticateUser(req.headers.get("Authorization"));
    logStep("User authenticated", { id: user.id, email: user.email });

    // Initialize Stripe
    const stripe = initializeStripe();

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(stripe, user);

    // Get the origin from the request or use the provided one
    const origin = body.origin || req.headers.get("origin") || "http://localhost:3000";
    logStep("Using origin", origin);

    // Prepare metadata
    const metadata: Record<string, string> = {
      user_id: user.id
    };
    
    if (body.assessment) {
      try {
        metadata.assessment_id = body.assessment.id || 'unknown';
        metadata.assessment_date = body.assessment.date || new Date().toISOString();
        
        if (body.assessment.dimensionScores) {
          metadata.dimension_scores = JSON.stringify(body.assessment.dimensionScores);
        }
      } catch (metadataErr) {
        logStep("Could not add assessment data to metadata", metadataErr);
      }
    }

    // Create checkout session
    const session = await createCheckoutSession(stripe, {
      customerId,
      origin,
      metadata
    });

    // Create payment record
    await createPaymentRecord({
      userId: user.id,
      sessionId: session.id,
      amount: 4900
    });

    // Return success response
    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      timestamp: Date.now() 
    }), {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/json"
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
