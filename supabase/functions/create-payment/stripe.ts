
import Stripe from "https://esm.sh/stripe@14.21.0";
import { User } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (message: string, details?: any) => {
  if (details) {
    console.log(`[create-payment] ${message}:`, typeof details === 'object' ? JSON.stringify(details) : details);
  } else {
    console.log(`[create-payment] ${message}`);
  }
};

export const initializeStripe = () => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  
  return new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });
};

export const getOrCreateStripeCustomer = async (stripe: Stripe, user: User) => {
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

export const createCheckoutSession = async (
  stripe: Stripe, 
  params: {
    customerId: string;
    origin: string;
    metadata: Record<string, string>;
    paymentType: 'one-time' | 'subscription';
  }
) => {
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
          unit_amount: 5400, // $54.00
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
          unit_amount: 699, // $6.99
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

