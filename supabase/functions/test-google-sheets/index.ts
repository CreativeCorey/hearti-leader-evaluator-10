
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
    
    // Check for Google service account email
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
    
    // For the identity configuration, we need the JSON credentials
    let serviceAccountKey
    try {
      const keyStr = Deno.env.get("GOOGLE_WORKLOAD_IDENTITY_CONFIG")
      if (!keyStr) {
        throw new Error("Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG")
      }
      
      // Try to parse as JSON if it's in JSON format
      try {
        serviceAccountKey = JSON.parse(keyStr)
        console.log("Successfully parsed service account key JSON")
      } catch (e) {
        console.log("Not JSON format, using as-is")
        serviceAccountKey = keyStr
      }
    } catch (error) {
      console.error("Error with service account key:", error.message)
      return new Response(
        JSON.stringify({ 
          error: "Invalid service account configuration",
          message: "Please check the GOOGLE_WORKLOAD_IDENTITY_CONFIG format. It should be a service account key JSON or a token.",
          details: error.message
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
    
    // Try to access Google Sheets API
    console.log("Attempting to send test data to Google Sheets...")
    
    // If we have a string, assume it's an access token
    let accessToken = typeof serviceAccountKey === 'string' ? serviceAccountKey : null
    
    // If we have a JSON object, try to use it to get an access token
    if (!accessToken && typeof serviceAccountKey === 'object') {
      try {
        console.log("Attempting to get access token from service account key")
        
        // Create JWT for Google Auth
        const jwtHeader = {
          alg: "RS256",
          typ: "JWT",
          kid: serviceAccountKey.private_key_id
        }
        
        const now = Math.floor(Date.now() / 1000)
        const oneHour = 60 * 60
        
        const jwtClaimSet = {
          iss: serviceAccountKey.client_email,
          scope: "https://www.googleapis.com/auth/spreadsheets",
          aud: "https://oauth2.googleapis.com/token",
          exp: now + oneHour,
          iat: now
        }
        
        // Using Deno.crypto to sign the JWT
        const encoder = new TextEncoder()
        const importedKey = await crypto.subtle.importKey(
          "pkcs8",
          new Uint8Array(
            atob(serviceAccountKey.private_key
              .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, ""))
              .split("")
              .map(c => c.charCodeAt(0))
          ),
          {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256"
          },
          false,
          ["sign"]
        )
        
        const jwtHeaderStr = btoa(JSON.stringify(jwtHeader))
          .replace(/=/g, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
        
        const jwtClaimSetStr = btoa(JSON.stringify(jwtClaimSet))
          .replace(/=/g, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
        
        const signatureInput = `${jwtHeaderStr}.${jwtClaimSetStr}`
        const signature = await crypto.subtle.sign(
          "RSASSA-PKCS1-v1_5",
          importedKey,
          encoder.encode(signatureInput)
        )
        
        const encodedSignature = btoa(
          String.fromCharCode(...new Uint8Array(signature))
        )
          .replace(/=/g, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
        
        const jwt = `${signatureInput}.${encodedSignature}`
        
        // Exchange JWT for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt
          }).toString()
        })
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          console.error("Token exchange error:", errorText)
          throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`)
        }
        
        const tokenData = await tokenResponse.json()
        accessToken = tokenData.access_token
        console.log("Successfully obtained access token")
      } catch (error) {
        console.error("Error getting access token:", error.message)
        return new Response(
          JSON.stringify({
            error: "Failed to get access token",
            message: error.message
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
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
    
    // Now we have an access token, try to use it to append to the sheet
    try {
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED`
      console.log("Making request to:", sheetsUrl)
      
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
