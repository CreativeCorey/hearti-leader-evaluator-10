import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Metadata-Flavor',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

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
    // Create a simple identity token (not a JWT, just a string token)
    const now = Math.floor(Date.now() / 1000);
    const tokenData = {
      iss: "https://odwkgxdkjyccnkydxvjw.supabase.co",
      sub: "supabase-edge-function",
      aud: "https://odwkgxdkjyccnkydxvjw.supabase.co", 
      iat: now,
      exp: now + 3600,
    };

    // Return a simple base64 encoded token instead of JWT
    const token = btoa(JSON.stringify(tokenData));

    // Return the token as expected
    return new Response(token, { 
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/plain"
      } 
    });
  } catch (error) {
    console.error("Error generating identity token:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return new Response(
      JSON.stringify({ error: "Failed to generate identity token", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});