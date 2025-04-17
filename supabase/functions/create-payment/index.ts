
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

// Function to create checkout session based on payment type
const createCheckoutSession = async (stripe: Stripe, params: {
  customerId: string,
  origin: string,
  metadata: Record<string, string>,
  paymentType: 'one-time' | 'subscription'
}) => {
  logStep("Creating checkout session", { paymentType: params.paymentType, metadata: params.metadata });
  
  const baseSessionConfig = {
    customer: params.customerId,
    success_url: `${params.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/`,
    metadata: params.metadata
  };

  if (params.paymentType === 'one-time') {
    const session = await stripe.checkout.sessions.create({
      ...baseSessionConfig,
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { 
            name: "HEARTI™ Leadership Assessment Results",
            description: "Lifetime Access"
          },
          unit_amount: 4900, // $49.00
        },
        quantity: 1,
      }],
    });
    logStep("Created one-time payment session", { id: session.id });
    return session;
  } else {
    const session = await stripe.checkout.sessions.create({
      ...baseSessionConfig,
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { 
            name: "HEARTI™ Leadership Assessment Results",
            description: "Monthly Subscription"
          },
          unit_amount: 799, // $7.99
          recurring: {
            interval: "month"
          }
        },
        quantity: 1,
      }],
    });
    logStep("Created subscription session", { id: session.id });
    return session;
  }
};

// Function to create payment record in database
const createPaymentRecord = async (params: {
  userId: string,
  sessionId: string,
  amount: number,
  type: 'one-time' | 'subscription'
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  logStep("Starting payment creation process");

  let body;
  try {
    body = await req.json();
    logStep("Request body", body);
  } catch (e) {
    logStep("Failed to parse request body", e);
    body = { timestamp: Date.now() };
  }

  try {
    const user = await authenticateUser(req.headers.get("Authorization"));
    logStep("User authenticated", { id: user.id, email: user.email });

    const stripe = initializeStripe();
    const customerId = await getOrCreateStripeCustomer(stripe, user);
    const origin = body.origin || req.headers.get("origin") || "http://localhost:3000";
    logStep("Using origin", origin);

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

    const paymentType = body.paymentType || 'one-time';
    const session = await createCheckoutSession(stripe, {
      customerId,
      origin,
      metadata,
      paymentType
    });

    await createPaymentRecord({
      userId: user.id,
      sessionId: session.id,
      amount: paymentType === 'one-time' ? 4900 : 799,
      type: paymentType
    });

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
