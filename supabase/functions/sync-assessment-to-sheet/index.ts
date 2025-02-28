
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Starting sync-assessment-to-sheet function with workload identity federation!")

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
    const sheetId = Deno.env.get("GOOGLE_SHEET_ID")
    if (!sheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID environment variable")
    }
    
    // Get the workload identity configuration
    const workloadIdentityConfig = Deno.env.get("GOOGLE_WORKLOAD_IDENTITY_CONFIG")
    if (!workloadIdentityConfig) {
      console.error("Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG")
      throw new Error("Missing GOOGLE_WORKLOAD_IDENTITY_CONFIG environment variable")
    }
    
    // Get service account email
    const serviceAccountEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    if (!serviceAccountEmail) {
      console.error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL")
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable")
    }
    
    console.log("Using service account email:", serviceAccountEmail)
    
    // Parse the workload identity configuration
    let configJson;
    try {
      configJson = JSON.parse(workloadIdentityConfig);
      console.log("Workload identity config parsed successfully");
    } catch (parseError) {
      console.error("Failed to parse workload identity config:", parseError.message);
      throw new Error("Invalid workload identity configuration format")
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
    
    // Get access token using workload identity federation
    console.log("Getting identity token from our provider...");
    
    // First, get our identity token from our own identity provider
    const identityResponse = await fetch(`https://odwkgxdkjyccnkydxvjw.functions.supabase.co/identity-token`, {
      headers: {
        "Metadata-Flavor": "Google"
      }
    });
    
    if (!identityResponse.ok) {
      const errorText = await identityResponse.text();
      console.error("Identity token request failed:", identityResponse.status, errorText);
      throw new Error(`Failed to get identity token: ${errorText}`);
    }
    
    const identityToken = await identityResponse.text();
    console.log("Got identity token");
    
    // Now exchange the identity token for a Google access token
    console.log("Exchanging identity token for Google access token...");
    
    // Prepare the token exchange using configuration from credential.json
    const tokenUrl = configJson.credential_source.url || "https://sts.googleapis.com/v1/token";
    const tokenRequest = {
      audience: configJson.audience,
      grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
      requestedTokenType: "urn:ietf:params:oauth:token-type:access_token",
      scope: "https://www.googleapis.com/auth/spreadsheets",
      subjectTokenType: configJson.subject_token_type || "urn:ietf:params:oauth:token-type:jwt",
      subjectToken: identityToken
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
      throw new Error(`Failed to get Google API access token: ${errorText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    if (!accessToken) {
      console.error("No access token in response:", JSON.stringify(tokenData));
      throw new Error("No access token received from Google Auth API");
    }
    
    console.log("Successfully obtained access token");
    
    // Try to append data to Google Sheet
    try {
      console.log("Attempting to append to sheet...")
      
      // Append data to the sheet
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A:Q:append?valueInputOption=USER_ENTERED`
      console.log("Making request to Google Sheets API...")
      
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
