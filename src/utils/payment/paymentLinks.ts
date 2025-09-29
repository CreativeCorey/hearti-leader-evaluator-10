// Stripe Payment Links Configuration
// Create these payment links in your Stripe Dashboard under Products > Payment links

export const STRIPE_PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/dRmfZgdKp4B66Rs1JSaIM04",
  annual: "https://buy.stripe.com/4gM4gy9u9gjO4JkgEMaIM02"
};

// IMPORTANT: Webhook Setup Required for Payment Verification
// ==========================================================
// 
// For payments to be verified, you MUST set up a Stripe webhook:
//
// 1. Go to Stripe Dashboard > Developers > Webhooks
// 2. Click "Add endpoint"
// 3. Set the endpoint URL to: https://odwkgxdkjyccnkydxvjw.supabase.co/functions/v1/stripe-webhook
// 4. Select these events to listen for:
//    - checkout.session.completed (for initial payment)
//    - invoice.paid (for subscription renewals)
// 5. Copy the webhook signing secret
// 6. Add the secret as STRIPE_WEBHOOK_SECRET in your Supabase edge function secrets
//
// Additionally, configure your Payment Links:
// 1. Navigate to Products > Payment links in Stripe Dashboard
// 2. For each payment link, ensure "Collect customer email" is enabled
// 3. This allows the webhook to match payments to users in your database