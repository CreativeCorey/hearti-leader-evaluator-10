
// Simple edge function that provides identity tokens for Google Workload Identity Federation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Metadata-Flavor',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

// Create a simple secret key for signing tokens
// In a production environment, this should be stored securely and kept consistent
const encoder = new TextEncoder();
const secretKey = "supabase-identity-token-secret-key-for-workload-identity-federation";
const keyBytes = encoder.encode(secretKey);

console.log("Identity token provider started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Check for Google metadata header
  const metadataFlavor = req.headers.get('Metadata-Flavor');
  if (metadataFlavor !== 'Google') {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Metadata-Flavor header" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Create a JWT token that will serve as the identity token
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: "https://odwkgxdkjyccnkydxvjw.supabase.co",
      sub: "supabase-edge-function", // Subject identifier
      aud: "https://odwkgxdkjyccnkydxvjw.supabase.co",
      iat: now,
      exp: now + 3600, // Token expires in 1 hour
    };

    // Sign the JWT with our key
    const jwt = await create({ alg: "HS256", typ: "JWT" }, payload, keyBytes);

    // Return the token as expected by the Google Workload Identity Federation
    return new Response(jwt, { 
      headers: { 
        ...corsHeaders, 
        "Content-Type": "application/text"
      } 
    });
  } catch (error) {
    console.error("Error generating identity token:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate identity token" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
