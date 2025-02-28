
// Simple edge function to test Google Sheets connectivity

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    // Let's check what environment variables we have available
    const envKeys = Object.keys(Deno.env.toObject())
    console.log("Available environment variables:", envKeys.join(", "))
    
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
    
    // Check for service account email
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    if (!serviceAccountEmail) {
      console.error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL")
      return new Response(
        JSON.stringify({ 
          error: "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL",
          message: "Please add your Google service account email to the Edge Function secrets"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    console.log("Using service account email:", serviceAccountEmail)
    
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
    console.log("Workload identity configuration is available")
    
    // Create very simple test data
    const testValues = [
      "test@example.com", 
      new Date().toISOString().split('T')[0],
      "test-id",
      "99", 
      "10", "10", "10", "10", "10", "10",
      "Test", "Test", "Test", "Test", "Test", "Test", "Test"
    ]
    
    // Get token for Google Sheets API
    let accessToken;
    try {
      console.log("Getting access token from workload identity configuration")
      // Try using the configuration directly as an access token first
      accessToken = workloadIdentityConfig;
      
      // If the configuration is a JSON credential file, we would need to use it to generate a token
      if (workloadIdentityConfig.startsWith("{")) {
        try {
          console.log("Parsing workload identity configuration as JSON")
          const credentials = JSON.parse(workloadIdentityConfig);
          
          if (credentials.type === "service_account" && credentials.private_key) {
            console.log("Found service account credentials with private key")
            
            // Here we would generate a JWT and exchange it for an access token
            // But for security best practices (avoiding private key handling), we'll suggest a better approach in the response
            
            return new Response(
              JSON.stringify({ 
                error: "Service account key detected",
                message: "For better security, please use a direct access token or federated identity instead of a service account key JSON.",
                suggestion: "Generate a token using the OAuth playground and set it directly as GOOGLE_WORKLOAD_IDENTITY_CONFIG"
              }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
          }
        } catch (parseError) {
          console.error("Failed to parse workload identity config as JSON:", parseError.message)
          // Continue using it as a plain token
        }
      }
    } catch (tokenError) {
      console.error("Error getting access token:", tokenError.message)
      return new Response(
        JSON.stringify({ 
          error: "Failed to get access token",
          message: tokenError.message,
          help: "Check your GOOGLE_WORKLOAD_IDENTITY_CONFIG format"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    if (!accessToken) {
      return new Response(
        JSON.stringify({ 
          error: "No valid access token",
          message: "Could not obtain a valid access token for Google Sheets API"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Try to use the token with Google Sheets API
    try {
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED`
      console.log("Making request to Google Sheets API...")
      
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
      
      console.log("Google Sheets API response:", response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Response body:", errorText)
        
        // Try to parse the error response
        try {
          const errorJson = JSON.parse(errorText)
          console.error("Error details:", JSON.stringify(errorJson, null, 2))
          
          // Check for specific error types
          const error = errorJson.error || {}
          
          if (error.status === 'UNAUTHENTICATED' || error.status === 401 || 
              response.status === 401 || errorText.includes("invalid_token")) {
            return new Response(
              JSON.stringify({ 
                error: "Authentication failed",
                message: "Your access token is invalid or expired. Please check your workload identity configuration.",
                details: error
              }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
          }
          
          if (error.status === 'PERMISSION_DENIED' || error.status === 403 || response.status === 403) {
            return new Response(
              JSON.stringify({ 
                error: "Permission denied",
                message: `The service account ${serviceAccountEmail} doesn't have permission to access this Google Sheet. Make sure the sheet is shared with this email.`,
                details: error
              }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            )
          }
          
          return new Response(
            JSON.stringify({ 
              error: "Google Sheets API error",
              status: response.status,
              message: error.message || "Unknown error",
              details: errorJson
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          )
        } catch (parseError) {
          console.error("Could not parse error response as JSON:", parseError.message)
          
          return new Response(
            JSON.stringify({ 
              error: "Google Sheets API error",
              status: response.status,
              message: errorText
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          )
        }
      }
      
      const result = await response.json()
      console.log("Success! Response from Google Sheets:", JSON.stringify(result, null, 2))
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Test data successfully sent to Google Sheets using workload identity",
          details: result
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } catch (fetchError) {
      console.error("Fetch error:", fetchError.message)
      
      return new Response(
        JSON.stringify({ 
          error: "Network error connecting to Google Sheets API",
          message: fetchError.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
  } catch (error) {
    console.error("Unexpected error in test function:", error.message, error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: "Unexpected error",
        message: error.message
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
