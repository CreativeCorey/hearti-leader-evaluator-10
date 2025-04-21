
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { authenticateUser } from "./auth.ts";
import { initializeStripe, getOrCreateStripeCustomer, createCheckoutSession } from "./stripe.ts";
import { createPaymentRecord } from "./database.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
};

// Helper logging function
const logStep = (message: string, details?: any) => {
  if (details) {
    console.log(`[create-payment] ${message}:`, typeof details === 'object' ? JSON.stringify(details) : details);
  } else {
    console.log(`[create-payment] ${message}`);
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

    const paymentType = body.paymentType || 'subscription';
    const session = await createCheckoutSession(stripe, {
      customerId,
      origin,
      metadata,
      paymentType
    });

    await createPaymentRecord({
      userId: user.id,
      sessionId: session.id,
      amount: paymentType === 'one-time' ? 5400 : 699,
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
