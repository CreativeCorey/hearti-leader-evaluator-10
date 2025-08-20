-- Fix service role detection in RLS policies for payments table

-- Drop the existing policies that have incorrect service role detection
DROP POLICY IF EXISTS "Authenticated edge functions can manage payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated edge functions can update payments" ON public.payments;

-- Create corrected policies that properly detect service role key usage
-- When using service role key, auth.uid() returns NULL and we bypass RLS entirely for service role
-- So we need a different approach: use a security definer function

-- Create a function to check if current context is service role
CREATE OR REPLACE FUNCTION public.is_service_role()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  -- Check if we're in a service role context by checking for service role key usage
  -- Service role bypasses RLS, so this function is mainly for explicit checks
  SELECT 
    auth.jwt() ->> 'role' = 'service_role' OR
    current_setting('role') = 'service_role' OR
    -- Additional check: if auth.uid() is NULL but we have an authenticated context
    (auth.uid() IS NULL AND current_setting('request.header.authorization', true) IS NOT NULL);
$$;

-- Create new secure policies for payment table
CREATE POLICY "Service role and users can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  -- Allow service role (edge functions) to insert payments
  is_service_role() OR
  -- Allow users to insert their own payment records
  auth.uid() = user_id
);

CREATE POLICY "Service role and users can update payments" 
ON public.payments 
FOR UPDATE 
USING (
  -- Allow service role (edge functions) to update any payment
  is_service_role() OR
  -- Allow users to update their own payment records
  auth.uid() = user_id
)
WITH CHECK (
  -- Same conditions for the update check
  is_service_role() OR
  auth.uid() = user_id
);

-- Also fix the subscribers table policies
DROP POLICY IF EXISTS "Service role can manage subscription data" ON public.subscribers;

CREATE POLICY "Service role can manage subscriptions" 
ON public.subscribers 
FOR ALL
USING (is_service_role())
WITH CHECK (is_service_role());

-- Fix historical profiles policy as well
DROP POLICY IF EXISTS "Authenticated services can manage historical profiles" ON public.historical_profiles;

CREATE POLICY "Service role can manage historical profiles" 
ON public.historical_profiles 
FOR INSERT 
WITH CHECK (is_service_role());

-- Grant execute permission on the service role check function
GRANT EXECUTE ON FUNCTION public.is_service_role() TO authenticated, anon;

-- Additional security: Create a more secure payment creation function for edge functions
CREATE OR REPLACE FUNCTION public.create_payment_secure(
  p_user_id uuid,
  p_stripe_session_id text,
  p_amount integer,
  p_status text DEFAULT 'pending'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  payment_id uuid;
BEGIN
  -- This function can only be called by service role or by the user for their own payments
  IF NOT (is_service_role() OR auth.uid() = p_user_id) THEN
    RAISE EXCEPTION 'Unauthorized access to payment creation';
  END IF;
  
  -- Validate inputs
  IF p_user_id IS NULL OR p_stripe_session_id IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid payment parameters';
  END IF;
  
  -- Insert the payment record
  INSERT INTO public.payments (user_id, stripe_session_id, amount, status)
  VALUES (p_user_id, p_stripe_session_id, p_amount, p_status)
  RETURNING id INTO payment_id;
  
  RETURN payment_id;
END;
$$;

-- Create secure payment update function
CREATE OR REPLACE FUNCTION public.update_payment_status_secure(
  p_stripe_session_id text,
  p_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function can only be called by service role
  IF NOT is_service_role() THEN
    RAISE EXCEPTION 'Unauthorized access to payment updates';
  END IF;
  
  -- Validate status
  IF p_status NOT IN ('pending', 'paid', 'failed', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid payment status';
  END IF;
  
  -- Update the payment record
  UPDATE public.payments 
  SET status = p_status, updated_at = now()
  WHERE stripe_session_id = p_stripe_session_id;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permissions to authenticated users (edge functions will use service role)
GRANT EXECUTE ON FUNCTION public.create_payment_secure(uuid, text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_payment_status_secure(text, text) TO authenticated;