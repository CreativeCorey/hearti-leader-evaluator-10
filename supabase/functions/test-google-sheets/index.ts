
// Simple edge function to test Google Sheets connectivity
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting test-google-sheets function with Google API key!")

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
    
    // Get Google API key (simple approach)
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY")
    if (!googleApiKey) {
      console.error("Missing GOOGLE_API_KEY")
      return new Response(
        JSON.stringify({ 
          error: "Missing Google API key",
          message: "Please add the GOOGLE_API_KEY secret"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    console.log("Using Google API key authentication")
    
    // Create very simple test data
    const testValues = [
      "test@example.com", 
      new Date().toISOString().split('T')[0],
      "test-id",
      "99", 
      "10", "10", "10", "10", "10", "10",
      "Test", "Test", "Test", "Test", "Test", "Test", "Test"
    ]
    
    // Try to use the API key with Google Sheets API
    try {
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED&key=${googleApiKey}`;
      console.log("Making request to Google Sheets API...");
      
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: {
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
                message: `The API key doesn't have permission to access this Google Sheet. Make sure the sheet is publicly accessible or the API key has the correct permissions.`,
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
          const parseErrorMessage = parseError instanceof Error ? parseError.message : 'Unknown error'
          console.error("Could not parse error response as JSON:", parseErrorMessage);
          
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
          message: "Test data successfully sent to Google Sheets using API key",
          details: result
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      const fetchErrorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error'
      console.error("Fetch error:", fetchErrorMessage);
      
      return new Response(
        JSON.stringify({ 
          error: "Network error connecting to Google Sheets API",
          message: fetchErrorMessage
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("Unexpected error in test function:", errorMessage, errorStack);
    
    return new Response(
      JSON.stringify({ 
        error: "Unexpected error",
        message: errorMessage
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
