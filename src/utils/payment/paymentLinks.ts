// Stripe Payment Links Configuration
// Create these payment links in your Stripe Dashboard under Products > Payment links

export const STRIPE_PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/dRmfZgdKp4B66Rs1JSaIM04",
  annual: "https://buy.stripe.com/4gM4gy9u9gjO4JkgEMaIM02"
};

// Instructions for setting up Payment Links in Stripe:
// 1. Go to your Stripe Dashboard
// 2. Navigate to Products > Payment links
// 3. Click "Create payment link"
// 4. Set up your products with the following pricing:
//    - Monthly: $19.99/month (recurring)
//    - Annual: $179.88/year (recurring, equivalent to $14.99/month)
//    - One-time: $199.99 (one-time payment)
// 5. Configure success/cancel URLs:
//    - Success URL: https://your-domain.com/payment-success?session_id={CHECKOUT_SESSION_ID}
//    - Cancel URL: https://your-domain.com/
// 6. Replace the URLs above with your actual payment link URLs