// Stripe Payment Links Configuration
// Create these payment links in your Stripe Dashboard under Products > Payment links

export const STRIPE_PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/YOUR_MONTHLY_LINK_HERE",
  annual: "https://buy.stripe.com/YOUR_ANNUAL_LINK_HERE", 
  oneTime: "https://buy.stripe.com/YOUR_ONE_TIME_LINK_HERE"
};

// Instructions for setting up Payment Links in Stripe:
// 1. Go to your Stripe Dashboard
// 2. Navigate to Products > Payment links
// 3. Click "Create payment link"
// 4. Set up your products with the following suggested pricing:
//    - Monthly: $9.99/month (recurring)
//    - Annual: $95.88/year (recurring, save 20%)
//    - One-time: $199.99 (one-time payment)
// 5. Configure success/cancel URLs:
//    - Success URL: https://your-domain.com/payment-success?session_id={CHECKOUT_SESSION_ID}
//    - Cancel URL: https://your-domain.com/
// 6. Replace the URLs above with your actual payment link URLs