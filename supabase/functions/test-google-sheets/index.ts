
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
    
    // Let's list all environment variables (without their values for security)
    const envKeys = Object.keys(Deno.env.toObject())
    console.log("Available environment variables:", envKeys.join(", "))
    
    // Check for Google service account email
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    if (!serviceAccountEmail) {
      console.error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL")
      return new Response(
        JSON.stringify({ 
          error: "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL",
          message: "The Google service account email is not configured"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    console.log("Service account email exists")
    
    // Check for Sheet ID
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")
    if (!sheetId) {
      console.error("Missing GOOGLE_SHEET_ID")
      return new Response(
        JSON.stringify({ 
          error: "Missing GOOGLE_SHEET_ID",
          message: "The Google Sheet ID is not configured"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    console.log("Sheet ID exists")
    
    // Check for token
    const identityConfig = Deno.env.get("GOOGLE_WORKLOAD_IDENTITY_CONFIG")
    if (!identityConfig) {
      console.error("Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG")
      return new Response(
        JSON.stringify({ 
          error: "Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG",
          message: "The Google workload identity configuration is not configured"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    console.log("Workload identity config exists")
    
    // Try to determine if this is a token
    try {
      // Check if it looks like a JWT (starts with ey and has two periods)
      const isJwt = identityConfig.startsWith("ey") && 
                   (identityConfig.match(/\./g) || []).length === 2
      
      console.log("Identity config appears to be a JWT:", isJwt)
      
      if (!isJwt) {
        console.log("Warning: GOOGLE_WORKLOAD_IDENTITY_CONFIG doesn't appear to be a JWT token")
      }
    } catch (error) {
      console.log("Error checking token format:", error.message)
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
    
    // Try to access Google Sheets API
    console.log("Attempting to send test data to Google Sheets...")
    
    let sheetsResponse
    
    try {
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED`
      console.log("Making request to:", sheetsUrl)
      
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${identityConfig}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [testValues]
        })
      })
      
      sheetsResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      }
      
      console.log("Google Sheets API response:", sheetsResponse)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Response body:", errorText)
        
        // Try to parse the error response
        try {
          const errorJson = JSON.parse(errorText)
          console.error("Error details:", JSON.stringify(errorJson, null, 2))
          
          return new Response(
            JSON.stringify({ 
              error: "Google Sheets API error",
              status: response.status,
              message: errorJson.error?.message || "Unknown error",
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
          message: "Test data successfully sent to Google Sheets",
          details: result
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } catch (fetchError) {
      console.error("Fetch error:", fetchError.message)
      
      return new Response(
        JSON.stringify({ 
          error: "Network error connecting to Google Sheets API",
          message: fetchError.message,
          response: sheetsResponse
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
