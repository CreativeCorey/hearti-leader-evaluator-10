
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting sync-assessment-to-sheet function!")

// Log all available environment variables (without their values for security)
const envKeys = Object.keys(Deno.env.toObject())
console.log("Available environment variables:", envKeys.join(", "))

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const reqData = await req.json()
    console.log("Received assessment data:", JSON.stringify(reqData, null, 2))

    // Check for required configuration
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    if (!serviceAccountEmail) {
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable")
    }
    
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")
    if (!sheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID environment variable")
    }
    
    // Check if we received assessment_id
    if (!reqData.assessment_id && !reqData.manual_sync) {
      console.log("No assessment_id, looking for user_id and other fields")
      
      // Check if we have minimum required data for a manual sync
      if (!reqData.user_id || !reqData.overall_score) {
        throw new Error("Missing required data: need either assessment_id or user_id + overall_score")
      }
    }

    // Create a Supabase client with the Admin key if we need to fetch assessment data
    let assessmentData = { ...reqData }
    
    if (reqData.assessment_id && (!reqData.dimension_scores || !reqData.overall_score)) {
      console.log(`Fetching complete assessment data for ID: ${reqData.assessment_id}`)
      
      const supabaseUrl = Deno.env.get("SUPABASE_URL")
      const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
      
      if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Missing Supabase credentials in environment")
      }
      
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
      
      const { data: fetchedData, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', reqData.assessment_id)
        .single()
        
      if (error) {
        console.error("Error fetching assessment:", error.message)
        throw new Error(`Failed to fetch assessment: ${error.message}`)
      } else if (fetchedData) {
        console.log("Retrieved assessment data from database")
        // Merge the fetched data with what we already have
        assessmentData = {
          ...reqData,
          user_id: reqData.user_id || fetchedData.user_id,
          date: reqData.date || fetchedData.date,
          overall_score: reqData.overall_score || fetchedData.overall_score,
          dimension_scores: reqData.dimension_scores || fetchedData.dimension_scores,
          demographics: reqData.demographics || fetchedData.demographics,
          email: reqData.email || fetchedData.email,
        }
      } else {
        throw new Error(`Assessment with ID ${reqData.assessment_id} not found`)
      }
    }

    // Build data for Google Sheet
    const email = assessmentData.email || `anonymous@${assessmentData.user_id?.substring(0, 8) || 'unknown'}.com`
    const date = assessmentData.date ? new Date(assessmentData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    
    // Format dimension scores
    const dimScores = assessmentData.dimension_scores || {}
    
    // Extract demographics if available
    const demo = assessmentData.demographics || {}
    
    // Prepare row data for Google Sheet
    const sheetData = {
      email,
      date,
      assessment_id: assessmentData.assessment_id || 'manual-sync-' + Date.now(),
      overall_score: assessmentData.overall_score || 0,
      humility: dimScores.humility || 0,
      empathy: dimScores.empathy || 0,
      accountability: dimScores.accountability || 0,
      resiliency: dimScores.resiliency || 0,
      transparency: dimScores.transparency || 0,
      inclusivity: dimScores.inclusivity || 0,
      // Demographics info
      gender: demo.gender || 'Not specified',
      race: demo.race || 'Not specified',
      age: demo.age || 'Not specified',
      location: demo.location || 'Not specified',
      role: demo.role || 'Not specified',
      management_level: demo.managementLevel || 'Not specified',
      company_size: demo.companySize || 'Not specified',
    }
    
    console.log("Formatted data for sheet:", JSON.stringify(sheetData, null, 2))
    
    // Convert data to an array of values for the sheet
    const values = [
      sheetData.email,
      sheetData.date,
      sheetData.assessment_id,
      sheetData.overall_score,
      sheetData.humility,
      sheetData.empathy,
      sheetData.accountability,
      sheetData.resiliency,
      sheetData.transparency,
      sheetData.inclusivity,
      sheetData.gender,
      sheetData.race,
      sheetData.age,
      sheetData.location,
      sheetData.role,
      sheetData.management_level,
      sheetData.company_size
    ]
    
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
      throw new Error(`Invalid service account configuration: ${error.message}`)
    }
    
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
        throw new Error(`Failed to get access token: ${error.message}`)
      }
    }
    
    if (!accessToken) {
      throw new Error("Could not obtain a valid access token for Google Sheets API")
    }
    
    // Try to append data to Google Sheet with our access token
    try {
      console.log("Attempting to append to sheet...")
      
      // Append data to the sheet
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED`
      console.log("Making request to:", sheetsUrl)
      
      const response = await fetch(sheetsUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [values]
        })
      })
      
      console.log("Google Sheets API response status:", response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Google Sheets API error response:", errorText)
        
        try {
          const errorJson = JSON.parse(errorText)
          console.error("Error details:", JSON.stringify(errorJson, null, 2))
          
          throw new Error(`Google Sheets API error: ${response.status} - ${errorJson.error?.message || "Unknown error"}`)
        } catch (parseError) {
          throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`)
        }
      }
      
      const result = await response.json()
      console.log("Successfully appended data to sheet:", JSON.stringify(result, null, 2))
      
      return new Response(
        JSON.stringify({ success: true, message: "Assessment synced to Google Sheet" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    } catch (error) {
      console.error("Error syncing to Google Sheet:", error.message)
      throw error
    }
  } catch (error) {
    console.error("Error in edge function:", error.message, error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: "Failed to sync assessment to Google Sheet. See function logs for details."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

// To invoke:
// curl -i --location --request POST 'https://odwkgxdkjyccnkydxvjw.functions.supabase.co/sync-assessment-to-sheet' \
//   --header 'Content-Type: application/json' \
//   --data '{"assessment_id":"123","user_id":"456","date":"2023-01-01","overall_score":85,"dimension_scores":{"humility":80}}'
