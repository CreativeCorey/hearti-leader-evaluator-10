import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!signature || !webhookSecret) {
      console.error("Missing signature or webhook secret");
      return new Response(
        JSON.stringify({ error: "Missing signature or webhook secret" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error("Webhook signature verification failed:", errorMessage);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${errorMessage}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing webhook event:", event.type);

    // Handle checkout.session.completed for payment links
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Checkout session completed:", session.id);
      console.log("Customer email:", session.customer_email);
      console.log("Amount total:", session.amount_total);

      if (!session.customer_email) {
        console.error("No customer email in session");
        return new Response(
          JSON.stringify({ error: "No customer email" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find user by email
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", session.customer_email)
        .single();

      if (profileError || !profile) {
        console.error("User not found for email:", session.customer_email, profileError);
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create payment record
      const { error: paymentError } = await supabaseAdmin
        .from("payments")
        .insert({
          user_id: profile.id,
          stripe_session_id: session.id,
          amount: session.amount_total || 0,
          status: "paid",
        });

      if (paymentError) {
        console.error("Failed to create payment record:", paymentError);
        return new Response(
          JSON.stringify({ error: "Failed to create payment record" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("Payment record created for user:", profile.id);
    }

    // Handle invoice.paid for subscription renewals
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      
      console.log("Invoice paid:", invoice.id);
      console.log("Customer email:", invoice.customer_email);

      if (!invoice.customer_email) {
        console.log("No customer email in invoice, skipping");
        return new Response(
          JSON.stringify({ received: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Find user by email
      const { data: profile, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", invoice.customer_email)
        .single();

      if (profileError || !profile) {
        console.error("User not found for email:", invoice.customer_email);
        return new Response(
          JSON.stringify({ received: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Create payment record for renewal
      const { error: paymentError } = await supabaseAdmin
        .from("payments")
        .insert({
          user_id: profile.id,
          stripe_session_id: invoice.id,
          amount: invoice.amount_paid || 0,
          status: "paid",
        });

      if (paymentError) {
        console.error("Failed to create payment record:", paymentError);
      } else {
        console.log("Payment record created for user:", profile.id);
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook handler error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
