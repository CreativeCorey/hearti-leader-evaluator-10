
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
    console.log("Test function invoked - attempting direct Google Sheets connection")
    
    // Fetch the necessary environment variables
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")
    const identityConfig = Deno.env.get("GOOGLE_WORKLOAD_IDENTITY_CONFIG")
    
    // Log available environment variables (without values for security)
    const envVars = Object.keys(Deno.env.toObject())
    console.log("Available environment variables:", envVars)
    
    if (!sheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID environment variable")
    }
    
    if (!identityConfig) {
      throw new Error("Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG environment variable")
    }
    
    console.log(`Using Sheet ID: ${sheetId.substring(0, 5)}...`)
    
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
    console.log("Sending test data to Google Sheets...")
    
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED`
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
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Sheets API error:", errorText)
      console.error("Response status:", response.status)
      throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`)
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
  } catch (error) {
    console.error("Error in test function:", error.message)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to connect to Google Sheets. Check function logs for details."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
