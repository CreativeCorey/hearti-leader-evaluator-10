# Stripe Payment Links Setup Guide

## Overview
Your payment system now uses Stripe Payment Links instead of custom edge functions. This gives you full control over pricing and settings in your Stripe dashboard.

## Setup Steps

### 1. Create Payment Links in Stripe Dashboard

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Payment links**
3. Click **"Create payment link"**

### 2. Create Three Payment Links

Create these three payment links with the suggested pricing:

#### Monthly Subscription
- **Product name**: "HEARTI™ Leadership Assessment - Monthly"
- **Price**: $9.99 USD
- **Billing**: Recurring monthly
- **Success URL**: `https://your-domain.com/payment-success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL**: `https://your-domain.com/`

#### Annual Subscription (20% discount)
- **Product name**: "HEARTI™ Leadership Assessment - Annual"
- **Price**: $95.88 USD (equivalent to $7.99/month)
- **Billing**: Recurring yearly
- **Success URL**: `https://your-domain.com/payment-success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL**: `https://your-domain.com/`

#### One-Time Payment
- **Product name**: "HEARTI™ Leadership Assessment - Lifetime Access"
- **Price**: $199.99 USD
- **Billing**: One-time payment
- **Success URL**: `https://your-domain.com/payment-success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL**: `https://your-domain.com/`

### 3. Update Payment Link URLs

After creating the payment links, copy their URLs and update the file:
`src/utils/payment/paymentLinks.ts`

Replace the placeholder URLs with your actual payment link URLs:

```typescript
export const STRIPE_PAYMENT_LINKS = {
  monthly: "https://buy.stripe.com/YOUR_ACTUAL_MONTHLY_LINK",
  annual: "https://buy.stripe.com/YOUR_ACTUAL_ANNUAL_LINK", 
  oneTime: "https://buy.stripe.com/YOUR_ACTUAL_ONE_TIME_LINK"
};
```

### 4. Benefits of This Approach

✅ **Dashboard Control**: Change pricing, add coupons, modify products directly in Stripe
✅ **No Edge Functions**: Simpler setup, no need for secret keys in edge functions
✅ **Stripe-Hosted**: Stripe handles the entire checkout experience
✅ **Automatic Tax**: Stripe can handle tax calculations if enabled
✅ **Multiple Payment Methods**: Supports all Stripe payment methods
✅ **Mobile Optimized**: Stripe's checkout is fully mobile responsive

### 5. Testing

- Use Stripe's test mode to create test payment links
- Test the payment flow before going live
- Switch to live mode when ready to accept real payments

### 6. Customer Portal (Optional)

You can still create a customer portal link in Stripe for users to manage their subscriptions:
- Go to **Settings** → **Billing** → **Customer portal**
- Configure the portal settings
- The existing customer portal edge function will continue to work

## Notes

- Payment links automatically handle subscription management
- Users can update payment methods, cancel subscriptions, etc. through the Stripe-hosted experience
- You maintain full control over pricing and product features in your Stripe dashboard
- No more hardcoded prices in your code!