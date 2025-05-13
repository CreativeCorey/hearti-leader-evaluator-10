
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Initialize Stripe with the secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    logStep("Stripe key verified");

    // Authenticate the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }
    logStep("Authorization header found");

    // Initialize Supabase client with anon key for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }

    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { email: user.email });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Lookup customer by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logStep("Found customer", { id: customerId });

    // Parse the request body to get the origin
    let origin = "https://lovable.dev"; // Fallback default
    try {
      const body = await req.json();
      if (body && body.origin) {
        origin = body.origin;
        logStep("Using origin from request body", { origin });
      } else {
        // Try to get origin from headers if not in body
        const headerOrigin = req.headers.get("origin");
        if (headerOrigin) {
          origin = headerOrigin;
          logStep("Using origin from headers", { origin });
        } else {
          logStep("Using default origin", { origin });
        }
      }
    } catch (error) {
      // If parsing fails, try to use the Origin header
      const headerOrigin = req.headers.get("origin");
      if (headerOrigin) {
        origin = headerOrigin;
        logStep("Using origin from headers after JSON parse failure", { origin });
      } else {
        logStep("Using default origin after parsing error", { origin, error: error.message });
      }
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/profile`,
    });
    logStep("Created portal session", { url: session.url });

    // Store the URL in case manual redirection is needed
    return new Response(JSON.stringify({ 
      url: session.url,
      timestamp: Date.now()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("Error", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
