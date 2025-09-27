-- Fix RLS policies for subscribers table to secure payment information
-- Drop existing policies
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscribers;

-- Create more secure RLS policies
-- Only authenticated users can view their own subscription data
CREATE POLICY "Users can view own subscription secure"
ON public.subscribers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Only service role can insert subscriptions (for Stripe webhooks)
CREATE POLICY "Service role can insert subscriptions"
ON public.subscribers
FOR INSERT
TO service_role
WITH CHECK (true);

-- Only service role can update subscription status
CREATE POLICY "Service role can update subscriptions"
ON public.subscribers
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Only service role can delete subscriptions
CREATE POLICY "Service role can delete subscriptions"
ON public.subscribers
FOR DELETE
TO service_role
USING (true);

-- Create a secure function to check active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = user_uuid 
    AND subscribed = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  );
$$;