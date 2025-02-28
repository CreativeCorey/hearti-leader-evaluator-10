
// Simple edge function to test Google Sheets connectivity
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { create, getToken } from "https://deno.land/x/jwt@v2.0.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting test-google-sheets function!")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("Test function invoked - checking configuration...")
    
    // Check for Sheet ID
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")
    if (!sheetId) {
      console.error("Missing GOOGLE_SHEET_ID")
      return new Response(
        JSON.stringify({ 
          error: "Missing GOOGLE_SHEET_ID",
          message: "Please add your Google Sheet ID to the Edge Function secrets"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    console.log("Using Sheet ID:", sheetId)
    
    // Get the service account credentials
    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    if (!serviceAccountKey) {
      console.error("Missing GOOGLE_SERVICE_ACCOUNT_KEY")
      return new Response(
        JSON.stringify({ 
          error: "Missing service account key",
          message: "Please add the GOOGLE_SERVICE_ACCOUNT_KEY secret"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Parse the service account key JSON
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
      console.log("Service account email:", serviceAccount.client_email);
    } catch (parseError) {
      console.error("Failed to parse service account key:", parseError.message);
      return new Response(
        JSON.stringify({ 
          error: "Invalid service account key format",
          message: "The GOOGLE_SERVICE_ACCOUNT_KEY does not contain valid JSON"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Create very simple test data
    const testValues = [
      "test@example.com", 
      new Date().toISOString().split('T')[0],
      "test-id",
      "99", 
      "10", "10", "10", "10", "10", "10",
      "Test", "Test", "Test", "Test", "Test", "Test", "Test"
    ]
    
    // Generate a JWT token for Google API authentication
    const now = Math.floor(Date.now() / 1000);
    const claims = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    };
    
    // Sign the JWT
    const jwt = await create({ alg: "RS256", typ: "JWT" }, claims, serviceAccount.private_key);
    
    // Exchange the JWT for an access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token request failed:", tokenResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to get Google API access token",
          status: tokenResponse.status,
          message: errorText
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      console.error("No access token in response:", JSON.stringify(tokenData));
      return new Response(
        JSON.stringify({ 
          error: "No access token received",
          message: "The token response did not contain an access_token"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Successfully obtained access token");
    
    // Try to use the token with Google Sheets API
    try {
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED`;
      console.log("Making request to Google Sheets API...");
      
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [testValues]
        })
      })
      
      console.log("Google Sheets API response:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response body:", errorText);
        
        // Try to parse the error response
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error details:", JSON.stringify(errorJson, null, 2));
          
          // Check for specific error types
          const error = errorJson.error || {};
          
          if (error.status === 'PERMISSION_DENIED' || error.status === 403 || response.status === 403) {
            return new Response(
              JSON.stringify({ 
                error: "Permission denied",
                message: `The service account ${serviceAccount.client_email} doesn't have permission to access this Google Sheet. Make sure the sheet is shared with this email.`,
                details: error
              }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          return new Response(
            JSON.stringify({ 
              error: "Google Sheets API error",
              status: response.status,
              message: error.message || "Unknown error",
              details: errorJson
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch (parseError) {
          console.error("Could not parse error response as JSON:", parseError.message);
          
          return new Response(
            JSON.stringify({ 
              error: "Google Sheets API error",
              status: response.status,
              message: errorText
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
      
      const result = await response.json();
      console.log("Success! Response from Google Sheets:", JSON.stringify(result, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Test data successfully sent to Google Sheets using service account",
          details: result
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      console.error("Fetch error:", fetchError.message);
      
      return new Response(
        JSON.stringify({ 
          error: "Network error connecting to Google Sheets API",
          message: fetchError.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Unexpected error in test function:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Unexpected error",
        message: error.message
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
