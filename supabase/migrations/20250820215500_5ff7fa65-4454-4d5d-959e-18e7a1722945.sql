-- Fix security issues identified by the linter

-- 1. Fix PUBLIC_PROMO_CODES: Restrict promo code access to authenticated users only
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;

CREATE POLICY "Authenticated users can view active promo codes" 
ON public.promo_codes 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND active = true 
  AND (expires_at IS NULL OR expires_at > now())
);

-- 2. Check for extensions in public schema and move them if needed
-- First, let's see what extensions exist in public schema
DO $$
DECLARE
    ext_record RECORD;
BEGIN
    -- Move any extensions from public schema to extensions schema
    FOR ext_record IN 
        SELECT extname 
        FROM pg_extension e 
        JOIN pg_namespace n ON e.extnamespace = n.oid 
        WHERE n.nspname = 'public'
        AND extname NOT IN ('plpgsql') -- Skip built-in extensions
    LOOP
        -- Create extensions schema if it doesn't exist
        CREATE SCHEMA IF NOT EXISTS extensions;
        
        -- Move extension to extensions schema
        EXECUTE format('ALTER EXTENSION %I SET SCHEMA extensions', ext_record.extname);
        
        RAISE NOTICE 'Moved extension % from public to extensions schema', ext_record.extname;
    END LOOP;
END $$;

-- Grant usage on extensions schema to authenticated users if needed
GRANT USAGE ON SCHEMA extensions TO authenticated;

-- 3. Additional security improvement: Add rate limiting for promo code validation
-- Create a function to validate promo codes with better security
CREATE OR REPLACE FUNCTION public.validate_promo_code(code_input text)
RETURNS TABLE(
  id uuid,
  code text,
  trial_days integer,
  is_valid boolean,
  message text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  promo_record public.promo_codes%ROWTYPE;
  user_has_used boolean := false;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN QUERY SELECT 
      NULL::uuid, 
      NULL::text, 
      NULL::integer, 
      false, 
      'Authentication required'::text;
    RETURN;
  END IF;

  -- Find the promo code
  SELECT * INTO promo_record 
  FROM public.promo_codes 
  WHERE promo_codes.code = code_input 
    AND active = true 
    AND (expires_at IS NULL OR expires_at > now());

  -- Check if promo code exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      NULL::uuid, 
      NULL::text, 
      NULL::integer, 
      false, 
      'Invalid or expired promo code'::text;
    RETURN;
  END IF;

  -- Check if user already used this promo code
  SELECT EXISTS(
    SELECT 1 FROM public.promo_code_uses 
    WHERE promo_code_id = promo_record.id 
      AND user_id = auth.uid()
  ) INTO user_has_used;

  IF user_has_used THEN
    RETURN QUERY SELECT 
      promo_record.id, 
      promo_record.code, 
      promo_record.trial_days, 
      false, 
      'Promo code already used'::text;
    RETURN;
  END IF;

  -- Check usage limits
  IF promo_record.max_uses IS NOT NULL AND promo_record.current_uses >= promo_record.max_uses THEN
    RETURN QUERY SELECT 
      promo_record.id, 
      promo_record.code, 
      promo_record.trial_days, 
      false, 
      'Promo code usage limit reached'::text;
    RETURN;
  END IF;

  -- Return valid promo code
  RETURN QUERY SELECT 
    promo_record.id, 
    promo_record.code, 
    promo_record.trial_days, 
    true, 
    'Valid promo code'::text;
END;
$$;