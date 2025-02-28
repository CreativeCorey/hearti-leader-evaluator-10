
// Simple edge function to test Google Sheets connectivity
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting test-google-sheets function with workload identity federation!")

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
    
    // Get the workload identity configuration
    const workloadIdentityConfig = Deno.env.get("GOOGLE_WORKLOAD_IDENTITY_CONFIG")
    if (!workloadIdentityConfig) {
      console.error("Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG")
      return new Response(
        JSON.stringify({ 
          error: "Missing workload identity configuration",
          message: "Please add the GOOGLE_WORKLOAD_IDENTITY_CONFIG secret"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Get service account email
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    if (!serviceAccountEmail) {
      console.error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL")
      return new Response(
        JSON.stringify({ 
          error: "Missing service account email",
          message: "Please add the GOOGLE_SERVICE_ACCOUNT_EMAIL secret"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    console.log("Using service account email:", serviceAccountEmail)
    
    // Parse the workload identity configuration
    let configJson;
    try {
      configJson = JSON.parse(workloadIdentityConfig);
      console.log("Workload identity config parsed successfully");
    } catch (parseError) {
      console.error("Failed to parse workload identity config:", parseError.message);
      return new Response(
        JSON.stringify({ 
          error: "Invalid workload identity configuration format",
          message: "The GOOGLE_WORKLOAD_IDENTITY_CONFIG does not contain valid JSON"
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
    
    // Get access token using the workload identity federation
    console.log("Requesting access token using workload identity federation...");
    
    const tokenUrl = "https://sts.googleapis.com/v1/token";
    const tokenRequest = {
      audience: configJson.audience,
      grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
      requestedTokenType: "urn:ietf:params:oauth:token-type:access_token",
      scope: "https://www.googleapis.com/auth/spreadsheets",
      subjectTokenType: configJson.subject_token_type,
      subjectToken: configJson.subject_token
    };
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(tokenRequest)
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token request failed:", tokenResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to get Google API access token",
          status: tokenResponse.status,
          message: errorText,
          request: tokenRequest
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
                message: `The service account ${serviceAccountEmail} doesn't have permission to access this Google Sheet. Make sure the sheet is shared with this email.`,
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
          message: "Test data successfully sent to Google Sheets using workload identity federation",
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
